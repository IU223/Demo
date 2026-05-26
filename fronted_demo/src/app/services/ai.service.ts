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

/**
 * AI HTTP 服务
 */
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

  // ==================== Step 5 实现 ====================
  // chatStream(body: AiChatRequest)

  // ==================== Step 6 实现 ====================
  // getSessions / getSessionById / updateSessionTitle / deleteSession

  // ==================== Step 10 实现 ====================
  // getTemplates()

  // ==================== Step 12 实现 ====================
  // getInsights()
}
