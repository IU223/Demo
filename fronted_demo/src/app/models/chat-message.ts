/**
 * AI 对话消息模型（前端）
 * 对应后端 chat_messages 表
 */
export interface ChatMessage {
  message_id?: number;
  session_id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
  is_favorite?: boolean;
  token_count?: number;
  created_at?: string;
}
