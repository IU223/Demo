import {inject} from '@loopback/core';
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
import {CurrentUserProfile} from '../interceptors/auth.interceptor';

/** POST /ai/chat 响应格式 */
const AI_CHAT_RESPONSE: ResponseObject = {
  description: 'AI chat response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          content: {type: 'string'},
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
  // 并发 SSE 连接上限
  private static activeStreams = 0;
  private static readonly MAX_CONCURRENT = parseInt(
    process.env.AI_MAX_CONCURRENT_STREAMS || '20',
    10,
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
  ) {}

  // ==================== 工具方法 ====================

  private getCurrentUser(): CurrentUserProfile {
    const user = (this.request as any).currentUser as
      | CurrentUserProfile
      | undefined;
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
      throw Object.assign(new Error('消息内容不能超过 2000 字符'), {
        statusCode: 400,
      });
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
              message: {type: 'string', description: '用户消息'},
              context: {
                type: 'object',
                description: '仪表盘数据上下文（可选）',
              },
            },
            required: ['message'],
          },
        },
      },
    })
    body: {message: string; context?: Record<string, any>},
  ): Promise<{content: string; usage?: object}> {
    const user = this.getCurrentUser();
    this.validateChatInput(body);

    const messages = this.contextBuilder.buildMessages(
      body.message,
      body.context,
      undefined,
    );

    const result = await this.aiService.chat(messages);

    console.log(
      `[AI Controller] chat | user=${user.employee_id}` +
        ` | message_length=${body.message.length}` +
        ` | has_context=${!!body.context}`,
    );

    return {
      content: result.content,
      usage: result.usage,
    };
  }

  // ==================== POST /ai/chat/stream（SSE 流式） ====================

  @post('/ai/chat/stream')
  @response(200, {
    description: 'SSE stream — 逐块返回 AI 回复',
    content: {
      'text/event-stream': {
        schema: {type: 'string'},
      },
    },
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
              message: {type: 'string', description: '用户消息'},
              context: {
                type: 'object',
                description: '仪表盘数据上下文（可选）',
              },
            },
            required: ['message'],
          },
        },
      },
    })
    body: {message: string; context?: Record<string, any>},
  ): Promise<Response> {
    const res = this.httpResponse;

    // 1. 鉴权
    const user = this.getCurrentUser();

    // 2. 输入校验
    this.validateChatInput(body);

    // 3. 并发连接上限保护
    if (AiChatController.activeStreams >= AiChatController.MAX_CONCURRENT) {
      res.status(503).json({
        error: {message: 'AI 服务繁忙，请稍后重试'},
      });
      return res;
    }

    // 4. SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(200);

    // 5. 追踪并发计数
    AiChatController.activeStreams++;

    // 6. 超时保护：60 秒
    let finished = false;
    const timeout = setTimeout(() => {
      if (finished) return;
      finished = true;
      try {
        res.write('data: [TIMEOUT]\n\n');
        res.end();
      } catch { /* response already closed */ }
    }, 60000);

    // 7. 心跳：每 15 秒
    const heartbeat = setInterval(() => {
      if (finished) return;
      try {
        res.write(':keepalive\n\n');
      } catch { /* ignore */ }
    }, 15000);

    // 8. 客户端断开检测
    this.request.on('close', () => {
      finished = true;
    });

    try {
      // 9. 构建消息列表
      const messages = this.contextBuilder.buildMessages(
        body.message,
        body.context,
        undefined,
      );

      // 10. 迭代 AI 流式输出
      for await (const chunk of this.aiService.chatStream(messages)) {
        if (finished) break;
        res.write(`data: ${JSON.stringify({content: chunk})}\n\n`);
      }

      // 11. 流正常结束
      if (!finished) {
        res.write('data: [DONE]\n\n');
      }

      console.log(
        `[AI Controller] stream complete | user=${user.employee_id}` +
          ` | message_length=${body.message.length}` +
          ` | has_context=${!!body.context}`,
      );
    } catch (err: any) {
      console.error(
        `[AI Controller] stream error | user=${user.employee_id}` +
          ` | error=${err.message}`,
      );
      if (!finished) {
        res.write(
          `data: ${JSON.stringify({error: '生成回复时出错，请重试'})}\n\n`,
        );
      }
    } finally {
      clearTimeout(timeout);
      clearInterval(heartbeat);
      AiChatController.activeStreams--;
      if (!finished) {
        finished = true;
        res.end();
      }
    }

    return res;
  }
}
