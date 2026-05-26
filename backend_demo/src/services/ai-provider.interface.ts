/**
 * AI Provider 抽象接口
 *
 * 现有 service（hash.service.ts、jwt.service.ts）为纯函数导出，
 * 但 AI Provider 需要维护 API Key、支持多实现（DeepSeek / Mock）切换，
 * 因此采用 接口 + 多实现类 的模式。
 */

/** AI 对话消息 */
export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** AI 调用选项 */
export interface ChatOptions {
  /** 最大输出 Token 数 */
  maxTokens?: number;
  /** 温度参数（0~2，越高越随机） */
  temperature?: number;
  /** 模型名称 */
  model?: string;
}

/** AI 非流式调用结果 */
export interface ChatResult {
  /** AI 回复内容 */
  content: string;
  /** Token 用量统计 */
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
}

/**
 * AI Provider 接口
 *
 * 所有 AI 供应商（DeepSeek、OpenAI、Mock 等）均需实现此接口。
 * 通过 application.ts 中的环境变量决定使用哪个实现。
 */
export interface AiProvider {
  /** 非流式对话：发送完整请求，等待完整回复 */
  chat(messages: AiMessage[], options?: ChatOptions): Promise<ChatResult>;

  /** 流式对话：逐块返回 AI 回复文本（用于 SSE 传输） */
  chatStream(
    messages: AiMessage[],
    options?: ChatOptions,
  ): AsyncIterable<string>;
}
