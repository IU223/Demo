import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * 功能型 HTTP 拦截器（Angular 17 standalone 风格）
 * 1. 自动在请求头附加 Authorization: Bearer <token>
 * 2. 遇到 401 响应自动清除 token 并跳转登录页
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  // 克隆请求并附加 Authorization 头
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // token 失效 → 清除本地存储 → 跳转登录
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
