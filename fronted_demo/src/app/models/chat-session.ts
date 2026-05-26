/**
 * AI 对话会话模型（前端）
 * 对应后端 chat_sessions 表
 */
export interface ChatSession {
  session_id?: number;
  employee_id: string;
  title?: string;
  mode?: 'chat' | 'analysis';
  is_deleted?: boolean;
  context_snapshot?: any;
  created_at?: string;
  updated_at?: string;
}
