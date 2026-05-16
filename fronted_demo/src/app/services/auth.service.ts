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
  iat: number;
  exp: number;
}

// ★ 新增：修改密码请求
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ★ 新增：忘记密码请求
export interface ForgotPasswordRequest {
  username: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * 登录
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
   * ★ 修改密码
   */
  changePassword(payload: ChangePasswordRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/change-password`,
      payload
    );
  }

  /**
   * ★ 忘记密码（无需登录态）
   */
  forgotPassword(payload: ForgotPasswordRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/forgot-password`,
      payload
    );
  }

  /**
   * 登出
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

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

  isTokenValid(): boolean {
    const payload = this.decodeToken();
    if (!payload) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  getCurrentUser(): LoginResponse['user'] | null {
    const raw = localStorage.getItem('user_info');
    return raw ? JSON.parse(raw) : null;
  }
}
