import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  post,
  requestBody,
  response,
  Response,
  ResponseObject,
  RestBindings,
  Request,
} from '@loopback/rest';
import {AiService} from '../services/ai.service';
import {AiContextBuilder} from '../services/ai-context-builder.service';
import {AiMessage} from '../services/ai-provider.interface';
import {CurrentUserProfile} from '../interceptors/auth.interceptor';
import {ChatSessionRepository, ChatMessageRepository} from '../repositories';

const AI_CHAT_RESPONSE: ResponseObject = {
  description: 'AI chat response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          content: {type: 'string'},
          session_id: {type: 'number'},
          usage: {
            type: 'object',
            properties: {
              input_tokens: {type: 'number'},
              output_tokens: {type: 'number'},
              total_tokens: {type: 'number'},
            },
          },
        },
      },
    },
  },
};

export class AiChatController {
  private static activeStreams = 0;
  private static readonly MAX_CONCURRENT = parseInt(
    process.env.AI_MAX_CONCURRENT_STREAMS || '20', 10,
  );

  constructor(
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @inject(RestBindings.Http.RESPONSE)
    private httpResponse: Response,
    @inject('services.AiService')
    private aiService: AiService,
    @inject('services.AiContextBuilder')
    private contextBuilder: AiContextBuilder,
    @repository(ChatSessionRepository)
    private chatSessionRepo: ChatSessionRepository,
    @repository(ChatMessageRepository)
    private chatMessageRepo: ChatMessageRepository,
  ) {}

  // ==================== 工具方法 ====================

  private getCurrentUser(): CurrentUserProfile {
    const user = (this.request as any).currentUser as CurrentUserProfile | undefined;
    if (!user) {
      throw Object.assign(new Error('未登录'), {statusCode: 401});
    }
    return user;
  }

  private validateChatInput(body: {
    message: string;
    context?: Record<string, any>;
  }): void {
    if (!body.message || !body.message.trim()) {
      throw Object.assign(new Error('消息内容不能为空'), {statusCode: 400});
    }
    if (body.message.length > 2000) {
      throw Object.assign(new Error('消息内容不能超过 2000 字符'), {statusCode: 400});
    }
    if (body.context) {
      const contextSize = JSON.stringify(body.context).length;
      if (contextSize > 4096) {
        throw Object.assign(
          new Error(`上下文数据过大（${contextSize} 字节），请精简后重试`),
          {statusCode: 400},
        );
      }
    }
  }

  // ==================== Step 6: 会话 & 消息持久化 ====================

  private async getOrCreateSession(
    employeeId: string,
    sessionId?: number,
    firstMessage?: string,
  ): Promise<number> {
    if (sessionId) {
      const session = await this.chatSessionRepo.findById(sessionId);
      if (session.employee_id !== employeeId) {
        throw Object.assign(new Error('无权访问此会话'), {statusCode: 403});
      }
      if (session.is_deleted) {
        throw Object.assign(new Error('会话已被删除'), {statusCode: 404});
      }
      return sessionId;
    }

    const title = this.generateSessionTitle(firstMessage || '新对话');
    const newSession = await this.chatSessionRepo.create({
      employee_id: employeeId,
      title,
      mode: 'chat',
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return newSession.session_id!;
  }

  private generateSessionTitle(message: string): string {
    const maxLen = 50;
    const cleaned = message.replace(/\n/g, ' ').trim();
    return cleaned.length > maxLen ? cleaned.substring(0, maxLen) + '...' : cleaned;
  }

  private async loadHistory(sessionId: number): Promise<AiMessage[]> {
    const prevMessages = await this.chatMessageRepo.find({
      where: {session_id: sessionId},
      order: ['created_at ASC'],
    });
    return prevMessages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
  }

  private async saveMessage(
    sessionId: number, role: string, content: string, tokenCount?: number,
  ): Promise<void> {
    await this.chatMessageRepo.create({
      session_id: sessionId,
      role,
      content,
      token_count: tokenCount,
      created_at: new Date().toISOString(),
    });
    await this.chatSessionRepo.updateById(sessionId, {
      updated_at: new Date().toISOString(),
    });
  }

  // ==================== POST /ai/chat（非流式） ====================

  @post('/ai/chat')
  @response(200, AI_CHAT_RESPONSE)
  async chat(
    @requestBody({
      description: 'AI chat request',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {type: 'string'},
              context: {type: 'object'},
              session_id: {type: 'number'},
            },
            required: ['message'],
          },
        },
      },
    })
    body: {message: string; context?: Record<string, any>; session_id?: number},
  ): Promise<{content: string; session_id: number; usage?: object}> {
    const user = this.getCurrentUser();
    this.validateChatInput(body);

    const sessionId = await this.getOrCreateSession(user.employee_id, body.session_id, body.message);
    const history = body.session_id ? await this.loadHistory(sessionId) : undefined;
    const messages = this.contextBuilder.buildMessages(body.message, body.context, history);

    await this.saveMessage(sessionId, 'user', body.message);

    const result = await this.aiService.chat(messages);

    await this.saveMessage(sessionId, 'assistant', result.content, result.usage?.output_tokens);

    console.log(
      `[AI Controller] chat | user=${user.employee_id}` +
        ` | session=${sessionId} | message_length=${body.message.length}`,
    );

    return {content: result.content, session_id: sessionId, usage: result.usage};
  }

  // ==================== POST /ai/chat/stream（SSE 流式） ====================

  @post('/ai/chat/stream')
  @response(200, {
    description: 'SSE stream',
    content: {'text/event-stream': {schema: {type: 'string'}}},
  })
  async chatStream(
    @requestBody({
      description: 'AI chat stream request',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {type: 'string'},
              context: {type: 'object'},
              session_id: {type: 'number'},
            },
            required: ['message'],
          },
        },
      },
    })
    body: {message: string; context?: Record<string, any>; session_id?: number},
  ): Promise<Response> {
    const res = this.httpResponse;
    const user = this.getCurrentUser();
    this.validateChatInput(body);

    if (AiChatController.activeStreams >= AiChatController.MAX_CONCURRENT) {
      res.status(503).json({error: {message: 'AI 服务繁忙，请稍后重试'}});
      return res;
    }

    let sessionId: number;
    try {
      sessionId = await this.getOrCreateSession(user.employee_id, body.session_id, body.message);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({error: {message: err.message || '会话创建失败'}});
      return res;
    }

    const history = body.session_id ? await this.loadHistory(sessionId) : undefined;
    await this.saveMessage(sessionId, 'user', body.message);

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(200);

    AiChatController.activeStreams++;

    let finished = false;
    const timeout = setTimeout(() => {
      if (finished) return;
      finished = true;
      try { res.write('data: [TIMEOUT]\n\n'); res.end(); } catch { /* */ }
    }, 60000);

    const heartbeat = setInterval(() => {
      if (finished) return;
      try { res.write(':keepalive\n\n'); } catch { /* */ }
    }, 15000);

    this.request.on('close', () => { finished = true; });

    // 先发送 meta 事件（含 session_id）
    if (!finished) {
      res.write(`data: ${JSON.stringify({meta: {session_id: sessionId}})}\n\n`);
    }

    let accumulatedContent = '';

    try {
      const messages = this.contextBuilder.buildMessages(body.message, body.context, history);

      for await (const chunk of this.aiService.chatStream(messages)) {
        if (finished) break;
        accumulatedContent += chunk;
        res.write(`data: ${JSON.stringify({content: chunk})}\n\n`);
      }

      if (!finished) {
        res.write('data: [DONE]\n\n');
      }

      if (accumulatedContent) {
        await this.saveMessage(sessionId, 'assistant', accumulatedContent);
      }

      console.log(
        `[AI Controller] stream complete | user=${user.employee_id}` +
          ` | session=${sessionId} | content_length=${accumulatedContent.length}`,
      );
    } catch (err: any) {
      console.error(
        `[AI Controller] stream error | user=${user.employee_id}` +
          ` | session=${sessionId} | error=${err.message}`,
      );

      if (accumulatedContent) {
        await this.saveMessage(sessionId, 'assistant',
          accumulatedContent + '\n\n⚠️ （生成中断）',
        ).catch(() => { /* */ });
      }

      if (!finished) {
        res.write(`data: ${JSON.stringify({error: '生成回复时出错，请重试'})}\n\n`);
      }
    } finally {
      clearTimeout(timeout);
      clearInterval(heartbeat);
      AiChatController.activeStreams--;
      if (!finished) { finished = true; res.end(); }
    }

    return res;
  }
}
