import {
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  bind,
  asGlobalInterceptor,
} from '@loopback/core';
import { RestBindings, Request } from '@loopback/rest';
import { verifyToken } from '../services/jwt.service';

/**
 * ★ Task 4: 用户信息接口，用于在请求上下文中传递当前用户
 */
export interface CurrentUserProfile {
  employee_id: string;
  name?: string;
  role_id?: number;
  is_super_admin?: boolean;
}

@bind(asGlobalInterceptor('auth'))
export class AuthInterceptor implements Provider<Interceptor> {
  value(): Interceptor {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ): Promise<InvocationResult> {
    console.log("拦截器被调用")
    let req: Request | undefined;
    try {
      req = await invocationCtx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });
    } catch {
      // 非 REST 调用时获取不到 request，直接放行
      return next();
    }

    // 如果拿不到 request 对象（非 HTTP 请求触发），直接放行
    if (!req) {
      return next();
    }

    console.log(`[AuthInterceptor] ${req.method} ${req.path}`);

    // 白名单路径
    const publicPaths = ['/login', '/ping', '/explorer', '/hash-password', '/openapi.json', '/forgot-password'];
    const isPublic = publicPaths.some(p => req!.path.startsWith(p));

    // 静态首页也放行
    if (req.path === '/' || req.path === '') {
      return next();
    }

    if (!isPublic) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw Object.assign(new Error('未提供有效的认证令牌'), {
          statusCode: 401,
        });
      }

      const token = authHeader.slice(7);
      try {
        const decoded = verifyToken(token);
        console.log('[AuthInterceptor] JWT 验证通过, 用户:', decoded.employee_id);

        // ★ Task 4 新增：将解码后的用户信息挂载到 request 对象上
        (req as any).currentUser = {
          employee_id: decoded.employee_id,
          name: decoded.name,
          role_id: decoded.role_id,
          is_super_admin: decoded.is_super_admin ?? false,
        } as CurrentUserProfile;

      } catch (err) {
        throw Object.assign(new Error('令牌无效或已过期'), {
          statusCode: 401,
        });
      }
    }

    return next();
  }
}
