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
 * 智谱 AI (ZhiPu) GLM Provider
 *
 * OpenAI 兼容 API 格式。
 * 官方 API 基础路径：https://open.bigmodel.cn/api/paas/v4
 * 完整端点：https://open.bigmodel.cn/api/paas/v4/chat/completions
 *
 * 与 DeepSeekProvider 的主要区别：
 *   1. 端点路径不同（智谱用 /api/paas/v4，DeepSeek 用 /v1）
 *   2. 默认模型名不同（glm-4.7-flash）
 */
export class ZhipuProvider implements AiProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultModel: string;

  constructor(apiKey: string, baseUrl?: string, defaultModel?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://open.bigmodel.cn/api/paas/v4';
    this.defaultModel = defaultModel || 'glm-4.7-flash';
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
                  `智谱 API 错误 (${res.statusCode}): ${data.substring(0, 500)}`,
                ),
              );
              return;
            }
            try {
              resolve(JSON.parse(data));
            } catch {
              reject(
                new Error(
                  `智谱 API 响应解析失败: ${data.substring(0, 200)}`,
                ),
              );
            }
          });
        },
      );

      req.on('error', (err: Error) =>
        reject(new Error(`智谱 API 请求失败: ${err.message}`)),
      );
      req.setTimeout(60000, () => {
        req.destroy();
        reject(new Error('智谱 API 请求超时 (60s)'));
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
                  `智谱 API 流式错误 (${res.statusCode}): ${errBody.substring(0, 500)}`,
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
        reject(new Error(`智谱 API 流式请求失败: ${err.message}`)),
      );
      req.setTimeout(60000, () => {
        req.destroy();
        reject(new Error('智谱 API 流式请求超时 (60s)'));
      });
      req.write(JSON.stringify(body));
      req.end();
    });
  }

  /**
   * 智谱 API 端点：{baseUrl}/chat/completions
   * 注意：baseUrl 已包含版本路径 /api/paas/v4
   */
  private getRequestOptions(): {
    reqOptions: https.RequestOptions;
    protocol: typeof https | typeof http;
  } {
    const urlObj = new URL(`${this.baseUrl}/chat/completions`);
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
