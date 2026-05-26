import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  response,
  ResponseObject,
  RestBindings,
  Request,
} from '@loopback/rest';
import {AiService} from '../services/ai.service';
import {AiContextBuilder} from '../services/ai-context-builder.service';
import {CurrentUserProfile} from '../interceptors/auth.interceptor';

/**
 * AI 对话控制器
 *
 * 拆分为独立 Controller，仅包含对话相关端点。
 *   - POST /ai/chat        （本步骤实现）
 *   - POST /ai/chat/stream  （Step 5 实现）
 */

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
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
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

  /**
   * 输入校验
   *
   * 规则：
   *   1. message 不能为空
   *   2. message 长度不超过 2000 字符
   *   3. context JSON 不超过 4096 字节
   */
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
          new Error(
            `上下文数据过大（${contextSize} 字节），请精简后重试`,
          ),
          {statusCode: 400},
        );
      }
    }
  }

  // ==================== POST /ai/chat ====================

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
                description: '仪表盘数据上下文（可选，Step 8 加入）',
              },
            },
            required: ['message'],
          },
        },
      },
    })
    body: {message: string; context?: Record<string, any>},
  ): Promise<{content: string; usage?: object}> {
    // 1. 鉴权
    const user = this.getCurrentUser();

    // 2. 输入校验
    this.validateChatInput(body);

    // 3. 构建消息列表
    const messages = this.contextBuilder.buildMessages(
      body.message,
      body.context,
      undefined, // history — Step 6 填充
    );

    // 4. 调用 AI 服务
    const result = await this.aiService.chat(messages);

    // 5. 日志记录
    console.log(
      `[AI Controller] chat | user=${user.employee_id}` +
        ` | message_length=${body.message.length}` +
        ` | has_context=${!!body.context}`,
    );

    // 6. 返回结果
    return {
      content: result.content,
      usage: result.usage,
    };
  }

  // ==================== POST /ai/chat/stream ====================
  // Step 5 实现
}
