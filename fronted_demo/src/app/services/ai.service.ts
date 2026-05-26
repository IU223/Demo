import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

export interface AiChatRequest {
  message: string;
  context?: Record<string, any>;
}

export interface AiChatResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
}

/** Step 5: 流式返回值类型 */
export interface ChatStreamHandle {
  stream$: Observable<string>;
  abort: () => void;
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

  /**
   * 流式对话 — 通过 fetch + ReadableStream 消费 SSE
   *
   * 1. 使用 AbortController 支持主动取消
   * 2. 手动附加 JWT（fetch 不走 Angular HttpClient 拦截器）
   * 3. 401 → 清除 token → 跳转登录页
   * 4. AbortError 静默处理
   */
  chatStream(body: AiChatRequest): ChatStreamHandle {
    const controller = new AbortController();
    const token = localStorage.getItem('auth_token');

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

                if (data === '[DONE]') {
                  observer.complete();
                  return;
                }
                if (data === '[TIMEOUT]') {
                  observer.error({ message: 'AI 响应超时，请重试' });
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.error) {
                    observer.error({ message: parsed.error });
                    return;
                  }
                  if (parsed.content) {
                    observer.next(parsed.content);
                  }
                } catch {
                  // 跳过格式异常
                }
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
          if (err.name === 'AbortError') {
            observer.complete();
            return;
          }
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
    };
  }

  // ==================== Step 6 实现 ====================
  // getSessions / getSessionById / updateSessionTitle / deleteSession

  // ==================== Step 10 实现 ====================
  // getTemplates()

  // ==================== Step 12 实现 ====================
  // getInsights()
}
