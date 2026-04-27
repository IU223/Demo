import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return true;
    }
    // 未登录，重定向到登录页
    return this.router.parseUrl('/login');
  }
}
