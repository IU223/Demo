import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { ChatSession } from '../models/chat-session';
import { ChatMessage } from '../models/chat-message';

export interface AiChatRequest {
  message: string;
  context?: Record<string, any>;
  session_id?: number;
}

export interface AiChatResponse {
  content: string;
  session_id?: number;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
}

export interface ChatStreamHandle {
  stream$: Observable<string>;
  abort: () => void;
  sessionId$: Observable<number>;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  chat(body: AiChatRequest): Observable<AiChatResponse> {
    return this.http.post<AiChatResponse>(`${this.apiUrl}/ai/chat`, body);
  }

  // ==================== SSE 流式对话 ====================

  chatStream(body: AiChatRequest): ChatStreamHandle {
    const controller = new AbortController();
    const token = localStorage.getItem('auth_token');
    const sessionIdSubject = new ReplaySubject<number>(1);

    const stream$ = new Observable<string>(observer => {
      fetch(`${this.apiUrl}/ai/chat/stream`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })
        .then(async res => {
          if (res.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');
            this.router.navigate(['/login']);
            observer.error({ status: 401, message: '登录已过期' });
            return;
          }
          if (res.status === 503) {
            observer.error({ status: 503, message: 'AI 服务繁忙，请稍后重试' });
            return;
          }
          if (!res.ok) {
            let msg = `AI 服务异常 (${res.status})`;
            try {
              const errBody = await res.json();
              msg = errBody?.error?.message || msg;
            } catch { /* ignore */ }
            observer.error({ status: res.status, message: msg });
            return;
          }

          const reader = res.body?.getReader();
          if (!reader) {
            observer.error({ message: '浏览器不支持流式读取' });
            return;
          }

          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith(':')) continue;
                if (!trimmed.startsWith('data: ')) continue;

                const data = trimmed.slice(6).trim();

                if (data === '[DONE]') { observer.complete(); return; }
                if (data === '[TIMEOUT]') {
                  observer.error({ message: 'AI 响应超时，请重试' });
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.meta?.session_id) {
                    sessionIdSubject.next(parsed.meta.session_id);
                    sessionIdSubject.complete();
                    continue;
                  }
                  if (parsed.error) { observer.error({ message: parsed.error }); return; }
                  if (parsed.content) { observer.next(parsed.content); }
                } catch { /* */ }
              }
            }
            observer.complete();
          } catch (readErr: any) {
            if (readErr.name !== 'AbortError') {
              observer.error({ message: readErr.message || '流读取异常' });
            }
          }
        })
        .catch(err => {
          if (err.name === 'AbortError') { observer.complete(); return; }
          if (!navigator.onLine) {
            observer.error({ status: 0, message: '网络连接已断开，请检查网络后重试' });
          } else {
            observer.error({ message: err.message || '请求失败' });
          }
        });
    });

    return {
      stream$,
      abort: () => controller.abort(),
      sessionId$: sessionIdSubject.asObservable(),
    };
  }

  // ==================== Step 6: 会话管理 API ====================

  getSessions(skip = 0, limit = 50): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>(`${this.apiUrl}/ai/sessions?skip=${skip}&limit=${limit}`);
  }

  getSessionDetail(sessionId: number): Observable<{ session: ChatSession; messages: ChatMessage[] }> {
    return this.http.get<{ session: ChatSession; messages: ChatMessage[] }>(`${this.apiUrl}/ai/sessions/${sessionId}`);
  }

  updateSessionTitle(sessionId: number, title: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/ai/sessions/${sessionId}`, { title });
  }

  deleteSession(sessionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ai/sessions/${sessionId}`);
  }
}
