import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService, PageAuthField } from '../services/auth.service';

/** 路由到页面权限字段的映射 */
const ROUTE_PAGE_MAP: Record<string, PageAuthField> = {
  '/default/welcome': 'home_page_auth',
  '/default/report': 'report_page_auth',
  '/default/permissions': 'auth_page_auth',
  '/default/audit-log': 'log_page_auth',
};

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return this.router.parseUrl('/login');
    }
    return true;
  }

  canActivateChild(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return this.router.parseUrl('/login');
    }

    // 超级管理员直接放行
    if (this.authService.isSuperAdmin()) {
      return true;
    }

    // 用目标 URL 匹配页面权限
    const pageField = this.resolvePageField(state.url);

    if (pageField && !this.authService.canViewPage(pageField)) {
      // 无查看权限 → 跳转到第一个有权限的页面
      const fallback = this.getFirstAllowedRoute();
      if (fallback) {
        return this.router.parseUrl(fallback);
      }
      // 所有页面都没有权限 → 跳转 /default
      return this.router.parseUrl('/default');
    }

    return true;
  }

  private resolvePageField(url: string): PageAuthField | null {
    for (const [route, field] of Object.entries(ROUTE_PAGE_MAP)) {
      if (url.startsWith(route)) {
        return field;
      }
    }
    return null;
  }

  private getFirstAllowedRoute(): string | null {
    const priorities: { route: string; field: PageAuthField }[] = [
      { route: '/default/welcome', field: 'home_page_auth' },
      { route: '/default/report', field: 'report_page_auth' },
      { route: '/default/permissions', field: 'auth_page_auth' },
      { route: '/default/audit-log', field: 'log_page_auth' },
    ];

    for (const { route, field } of priorities) {
      if (this.authService.canViewPage(field)) {
        return route;
      }
    }
    return null;
  }
}
