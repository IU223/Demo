import {
  AiProvider,
  AiMessage,
  ChatOptions,
  ChatResult,
} from './ai-provider.interface';

/**
 * Mock AI Provider
 *
 * ★ FIX-06：开发环境 Mock 模式，避免每次调用真实 AI API 产生费用。
 *   通过 AI_MOCK=true 环境变量启用。
 *
 * ★ 修复：使用 require() 加载 JSON（而非 fs.readFileSync），
 *   确保 lb-tsc 编译后 JSON 数据可被正确引用。
 */

/** Mock 响应条目 */
interface MockResponseEntry {
  keywords: string[];
  response: string;
}

/** Mock 数据文件结构 */
interface MockDataFile {
  responses: MockResponseEntry[];
  defaultResponse: string;
}

// ★ 修复：使用 require() 替代 fs.readFileSync()
// require() 会让 Node.js 模块系统解析 JSON，无需手动拼路径
let mockData: MockDataFile;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  mockData = require('./ai-mock-responses.json');
} catch {
  console.warn('[AI Mock] 未找到 ai-mock-responses.json，使用内置默认回复');
  mockData = {
    responses: [],
    defaultResponse:
      'Mock AI 回复：已收到您的消息，这是一条模拟回复。请配置 ai-mock-responses.json 以获得更真实的测试体验。',
  };
}

export class MockProvider implements AiProvider {
  async chat(
    messages: AiMessage[],
    _options?: ChatOptions,
  ): Promise<ChatResult> {
    // 模拟网络延迟（500ms ~ 1500ms）
    await this.delay(500 + Math.random() * 1000);

    const userMessage = this.getLastUserMessage(messages);
    const response = this.findMockResponse(userMessage);

    return {
      content: response,
      usage: {
        input_tokens: Math.ceil(userMessage.length / 2),
        output_tokens: Math.ceil(response.length / 2),
        total_tokens: Math.ceil((userMessage.length + response.length) / 2),
      },
    };
  }

  async *chatStream(
    messages: AiMessage[],
    _options?: ChatOptions,
  ): AsyncGenerator<string> {
    // 模拟首 token 延迟（200ms ~ 500ms）
    await this.delay(200 + Math.random() * 300);

    const userMessage = this.getLastUserMessage(messages);
    const response = this.findMockResponse(userMessage);

    // 模拟流式输出：每 30~80ms 输出 2~5 个字符
    const chunkSize = 3;
    for (let i = 0; i < response.length; i += chunkSize) {
      await this.delay(30 + Math.random() * 50);
      yield response.slice(i, i + chunkSize);
    }
  }

  // ==================== 私有方法 ====================

  private getLastUserMessage(messages: AiMessage[]): string {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return messages[i].content;
      }
    }
    return '';
  }

  private findMockResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();

    for (const item of mockData.responses) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        return item.response;
      }
    }

    return mockData.defaultResponse;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
