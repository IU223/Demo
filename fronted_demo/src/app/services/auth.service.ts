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
    is_super_admin?: boolean;
    home_page_auth?: number;
    report_page_auth?: number;
    auth_page_auth?: number;
    log_page_auth?: number;
  };
}

/** 页面权限字段名 */
export type PageAuthField = 'home_page_auth' | 'report_page_auth' | 'auth_page_auth' | 'log_page_auth';

/** JWT Payload 中的字段（与后端 JwtPayload 对应） */
export interface TokenPayload {
  employee_id: string;
  name?: string;
  role_id?: number;
  is_super_admin?: boolean;
  home_page_auth?: number;
  report_page_auth?: number;
  auth_page_auth?: number;
  log_page_auth?: number;
  iat: number;
  exp: number;
}

/** 页面权限位掩码常量 */
export const PagePermission = {
  READ: 1,
  CREATE: 2,
  DELETE: 4,
  UPDATE: 8,
} as const;

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

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.is_super_admin === true;
  }

  /** ★ 从 JWT Token 中获取页面权限值（同步，无需 API 调用） */
  getPageAuthFromToken(field: PageAuthField): number {
    const payload = this.decodeToken();
    if (!payload) return 0;
    return payload[field] ?? 0;
  }

  /** ★ 判断当前用户对某页面是否有某项权限（位运算） */
  hasPagePermission(field: PageAuthField, perm: number): boolean {
    return (this.getPageAuthFromToken(field) & perm) === perm;
  }

  /** ★ 判断当前用户对某页面是否有查看权限 */
  canViewPage(field: PageAuthField): boolean {
    if (this.isSuperAdmin()) return true;
    return this.hasPagePermission(field, PagePermission.READ);
  }
}
