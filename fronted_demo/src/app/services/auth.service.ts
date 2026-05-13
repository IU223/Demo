import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    employee_id: string;
    name?: string;
    role_id?: number;
  };
}

/** JWT Payload 中的字段（与后端 JwtPayload 对应） */
export interface TokenPayload {
  employee_id: string;
  name?: string;
  role_id?: number;
  iat: number;    // 签发时间（秒级时间戳）
  exp: number;    // 过期时间（秒级时间戳）
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * 登录：调用后端 /login，成功后自动存储 token 和用户信息
   */
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
        }
        if (res.user) {
          localStorage.setItem('user_info', JSON.stringify(res.user));
        }
      })
    );
  }

  /**
   * 登出：清除本地存储
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }

  /**
   * 获取当前存储的 token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * 解析 JWT payload（不做签名验证，仅解码）
   */
  decodeToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson) as TokenPayload;
    } catch {
      return null;
    }
  }

  /**
   * 判断 token 是否未过期
   */
  isTokenValid(): boolean {
    const payload = this.decodeToken();
    if (!payload) return false;

    const now = Math.floor(Date.now() / 1000); // 当前秒级时间戳
    return payload.exp > now;
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): LoginResponse['user'] | null {
    const raw = localStorage.getItem('user_info');
    return raw ? JSON.parse(raw) : null;
  }
}
