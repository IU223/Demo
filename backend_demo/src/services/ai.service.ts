import {injectable, inject} from '@loopback/core';
import {
  AiProvider,
  AiMessage,
  ChatOptions,
  ChatResult,
} from './ai-provider.interface';

/**
 * AI 服务（核心业务层）
 *
 * 现有 service（hash.service.ts、jwt.service.ts）为纯函数导出，
 * 但 AiService 需要注入 AiProvider 依赖、维护状态，因此采用 DI 类模式。
 *
 * 职责：
 *   1. 代理 AiProvider 的 chat / chatStream 方法
 *   2. 统一日志记录（耗时、Token 消耗）
 *   3. 后续阶段将在此层添加：配额检查、用量记录、数据脱敏等
 */
@injectable()
export class AiService {
  constructor(
    @inject('services.AiProvider')
    private provider: AiProvider,
  ) {}

  /**
   * 非流式对话
   */
  async chat(
    messages: AiMessage[],
    options?: ChatOptions,
  ): Promise<ChatResult> {
    const start = Date.now();
    const model = options?.model || 'default';

    try {
      const result = await this.provider.chat(messages, options);
      const elapsed = Date.now() - start;

      console.log(
        `[AI] chat | model=${model}` +
          ` | input_tokens=${result.usage?.input_tokens ?? '?'}` +
          ` | output_tokens=${result.usage?.output_tokens ?? '?'}` +
          ` | total_tokens=${result.usage?.total_tokens ?? '?'}` +
          ` | elapsed=${elapsed}ms`,
      );

      return result;
    } catch (err: any) {
      const elapsed = Date.now() - start;
      console.error(
        `[AI] chat ERROR | model=${model}` +
          ` | elapsed=${elapsed}ms` +
          ` | error=${err.message}`,
      );
      throw err;
    }
  }

  /**
   * 流式对话（用于 SSE 传输）
   */
  async *chatStream(
    messages: AiMessage[],
    options?: ChatOptions,
  ): AsyncGenerator<string> {
    const start = Date.now();
    const model = options?.model || 'default';
    let totalChunks = 0;
    let totalChars = 0;

    try {
      for await (const chunk of this.provider.chatStream(messages, options)) {
        totalChunks++;
        totalChars += chunk.length;
        yield chunk;
      }

      const elapsed = Date.now() - start;
      console.log(
        `[AI] stream | model=${model}` +
          ` | chunks=${totalChunks}` +
          ` | chars=${totalChars}` +
          ` | elapsed=${elapsed}ms`,
      );
    } catch (err: any) {
      const elapsed = Date.now() - start;
      console.error(
        `[AI] stream ERROR | model=${model}` +
          ` | chunks=${totalChunks}` +
          ` | elapsed=${elapsed}ms` +
          ` | error=${err.message}`,
      );
      throw err;
    }
  }
}
