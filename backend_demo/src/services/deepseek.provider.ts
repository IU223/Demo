import * as https from 'https';
import * as http from 'http';
import {URL} from 'url';
import {
  AiProvider,
  AiMessage,
  ChatOptions,
  ChatResult,
} from './ai-provider.interface';

/**
 * DeepSeek API Provider
 *
 * 使用 OpenAI 兼容的 API 格式。
 * 后续若需切换至 OpenAI / 通义千问，只需新建 Provider 实现类，
 * 无需修改 AiService 和 Controller。
 *
 * 使用 Node.js 内置 https/http 模块而非 fetch，
 * 以避免 @types/node@16 缺少 fetch 类型定义的问题。
 */
export class DeepSeekProvider implements AiProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultModel: string;
  private readonly timeoutMs: number;

  constructor(apiKey: string, baseUrl?: string, defaultModel?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://api.deepseek.com';
    this.defaultModel = defaultModel || 'deepseek-chat';
    this.timeoutMs = parseInt(process.env.AI_API_TIMEOUT || '60', 10) * 1000;
  }

  // ==================== 公开方法 ====================

  async chat(
    messages: AiMessage[],
    options?: ChatOptions,
  ): Promise<ChatResult> {
    const body = this.buildRequestBody(messages, options, false);
    const responseData = await this.postJson(body);

    const choice = responseData.choices?.[0];
    return {
      content: choice?.message?.content || '',
      usage: responseData.usage
        ? {
            input_tokens: responseData.usage.prompt_tokens || 0,
            output_tokens: responseData.usage.completion_tokens || 0,
            total_tokens: responseData.usage.total_tokens || 0,
          }
        : undefined,
    };
  }

  async *chatStream(
    messages: AiMessage[],
    options?: ChatOptions,
  ): AsyncGenerator<string> {
    const body = this.buildRequestBody(messages, options, true);
    const res = await this.postStream(body);

    let buffer = '';

    for await (const rawChunk of res) {
      buffer += String(rawChunk);
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (!trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6).trim();
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // 跳过格式异常的 JSON 行
        }
      }
    }
  }

  // ==================== 私有方法 ====================

  private buildRequestBody(
    messages: AiMessage[],
    options?: ChatOptions,
    stream = false,
  ): object {
    return {
      model: options?.model || this.defaultModel,
      messages,
      max_tokens: options?.maxTokens || 4000,
      temperature: options?.temperature ?? 0.7,
      stream,
    };
  }

  private postJson(body: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const {reqOptions, protocol} = this.getRequestOptions();

      const req = protocol.request(
        reqOptions,
        (res: http.IncomingMessage) => {
          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk: string) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 400) {
              reject(
                new Error(
                  `DeepSeek API 错误 (${res.statusCode}): ${data.substring(0, 500)}`,
                ),
              );
              return;
            }
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(
                new Error(
                  `DeepSeek API 响应解析失败: ${data.substring(0, 200)}`,
                ),
              );
            }
          });
        },
      );

      req.on('error', (err: Error) =>
        reject(new Error(`DeepSeek API 请求失败: ${err.message}`)),
      );
      req.setTimeout(this.timeoutMs, () => {
        req.destroy();
        reject(new Error(`DeepSeek API 请求超时 (${this.timeoutMs / 1000}s)`));
      });
      req.write(JSON.stringify(body));
      req.end();
    });
  }

  private postStream(body: object): Promise<http.IncomingMessage> {
    return new Promise((resolve, reject) => {
      const {reqOptions, protocol} = this.getRequestOptions();

      const req = protocol.request(
        reqOptions,
        (res: http.IncomingMessage) => {
          if (res.statusCode && res.statusCode >= 400) {
            let errBody = '';
            res.setEncoding('utf8');
            res.on('data', (chunk: string) => {
              errBody += chunk;
            });
            res.on('end', () => {
              reject(
                new Error(
                  `DeepSeek API 流式错误 (${res.statusCode}): ${errBody.substring(0, 500)}`,
                ),
              );
            });
            return;
          }
          res.setEncoding('utf8');
          resolve(res);
        },
      );

      req.on('error', (err: Error) =>
        reject(new Error(`DeepSeek API 流式请求失败: ${err.message}`)),
      );
      req.setTimeout(this.timeoutMs, () => {
        req.destroy();
        reject(new Error(`DeepSeek API 流式请求超时 (${this.timeoutMs / 1000}s)`));
      });
      req.write(JSON.stringify(body));
      req.end();
    });
  }

  private getRequestOptions(): {
    reqOptions: https.RequestOptions;
    protocol: typeof https | typeof http;
  } {
    const urlObj = new URL(`${this.baseUrl}/v1/chat/completions`);
    const isHttps = urlObj.protocol === 'https:';

    return {
      reqOptions: {
        hostname: urlObj.hostname,
        port: urlObj.port
          ? parseInt(urlObj.port, 10)
          : isHttps
            ? 443
            : 80,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
      protocol: isHttps ? https : http,
    };
  }
}
