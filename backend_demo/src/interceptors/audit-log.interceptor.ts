import {
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  bind,
  asGlobalInterceptor,
} from '@loopback/core';
import {RestBindings, Request} from '@loopback/rest';
import {AuditLog} from '../models';
import {AuditLogRepository} from '../repositories';

// ==================== 常量配置 ====================

/** URL 路径前缀 → 资源类型映射 */
const PATH_RESOURCE_MAP: Record<string, string> = {
  '/employees': 'Employee',
  '/roles': 'Role',
  '/departments': 'Department',
  '/plants': 'Plant',
  '/regions': 'Region',
};

/** 资源类型 → Repository 绑定 key */
const REPO_BINDINGS: Record<string, string> = {
  Employee: 'repositories.EmployeeRepository',
  Role: 'repositories.RoleRepository',
  Department: 'repositories.DepartmentRepository',
  Plant: 'repositories.PlantRepository',
  Region: 'repositories.RegionRepository',
};

/** 跳过的路径（手动记录或无需记录） */
const SKIP_PATHS = [
  '/audit-logs',
  '/login',
  '/forgot-password',
  '/change-password',
  '/hash-password',
  '/ping',
  '/explorer',
  '/openapi.json',
];

/** 需要脱敏的字段名 */
const SENSITIVE_FIELDS = ['password'];

// ==================== 拦截器 ====================

/**
 * 全局审计日志拦截器
 *
 * 执行顺序说明：
 *   LoopBack 4 按 group 名字母序排列全局拦截器。
 *   'audit' < 'auth'，所以 AuditLogInterceptor 是**外层**，AuthInterceptor 是**内层**。
 *   流程：Audit.intercept() → next() → Auth.intercept() → next() → Controller
 *   在 Audit 的 finally 块中，Auth 已执行完毕，currentUser 已挂载到 request 上。
 */
@bind(asGlobalInterceptor('audit'))
export class AuditLogInterceptor implements Provider<Interceptor> {
  value(): Interceptor {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ): Promise<InvocationResult> {
    // ── 1. 获取 HTTP 请求对象 ──
    let req: Request | undefined;
    try {
      req = await invocationCtx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });
    } catch {
      return next();
    }
    if (!req) return next();

    // ── 2. 仅拦截写操作 ──
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
      return next();
    }

    // ── 3. 跳过特殊路径 ──
    if (
      req.path === '/' ||
      req.path === '' ||
      SKIP_PATHS.some(p => req!.path.startsWith(p))
    ) {
      return next();
    }

    // ── 4. 解析资源类型和资源 ID ──
    const {resourceType, resourceId} = this.parseResource(req.path);
    if (!resourceType) {
      return next();
    }

    // ── 5. 提前获取 AuditLogRepository（避免 finally 中异步解析） ──
    let auditLogRepo: AuditLogRepository;
    try {
      auditLogRepo = await invocationCtx.get<AuditLogRepository>(
        'repositories.AuditLogRepository',
      );
    } catch {
      return next();
    }

    // ── 6. 获取变更前的数据快照（仅 UPDATE / DELETE） ──
    let oldValue: string | undefined;
    if (['PATCH', 'PUT', 'DELETE'].includes(req.method) && resourceId) {
      oldValue = await this.fetchOldValue(
        invocationCtx,
        resourceType,
        resourceId,
      );
    }

    // ── 7. 执行原始操作 ──
    let result: InvocationResult = undefined;
    let statusCode = 0;
    let errorMessage: string | undefined;

    try {
      result = await next();

      // 根据 HTTP 方法推断成功状态码
      if (req.method === 'POST') {
        statusCode = 200;
      } else if (resourceId) {
        statusCode = 204;
      } else {
        statusCode = 200;
      }
    } catch (err: any) {
      statusCode = err.statusCode ?? 500;
      errorMessage = err.message;
      throw err;
    } finally {
      // ── 8. 构建日志条目 ──
      const currentUser = (req as any).currentUser;

      // CREATE 操作：从返回结果中提取新资源 ID
      let finalResourceId = resourceId;
      if (req.method === 'POST' && !finalResourceId && result) {
        finalResourceId = this.extractCreatedId(result) ?? null;
      }

      // 批量 PATCH（无 ID）：捕获 where 条件
      if (['PATCH', 'PUT'].includes(req.method) && !resourceId) {
        try {
          const url = new URL(
            req.url,
            `http://${req.headers.host || 'localhost'}`,
          );
          const whereParam = url.searchParams.get('where');
          if (whereParam) {
            finalResourceId = `[batch] ${whereParam}`;
          }
        } catch {
          /* URL 解析失败，忽略 */
        }
      }

      const action = this.determineAction(req.method, !!resourceId);
      const sanitizedBody = this.sanitize(req.body);

      const logEntry: Partial<AuditLog> = {
        operator_id: currentUser?.employee_id ?? 'ANONYMOUS',
        operator_name: currentUser?.name,
        action,
        resource_type: resourceType,
        resource_id: finalResourceId ?? undefined,
        request_method: req.method,
        request_path: req.path,
        ip_address: req.ip ?? req.socket?.remoteAddress,
        old_value: oldValue,
        new_value:
          ['POST', 'PATCH', 'PUT'].includes(req.method) && sanitizedBody
            ? JSON.stringify(sanitizedBody)
            : undefined,
        status_code: statusCode,
        error_message: errorMessage,
      };

      // ── 9. 异步写入日志（Fire-and-forget，不阻塞响应） ──
      auditLogRepo.create(logEntry as AuditLog).catch(err => {
        console.error('[AuditLog] 日志写入失败:', err);
      });
    }

    return result;
  }

  // ==================== 工具方法 ====================

  /**
   * 从 URL 路径解析资源类型和资源 ID
   */
  private parseResource(path: string): {
    resourceType: string | null;
    resourceId: string | null;
  } {
    for (const [prefix, type] of Object.entries(PATH_RESOURCE_MAP)) {
      if (path.startsWith(prefix)) {
        const rest = path.substring(prefix.length);

        if (!rest || rest === '/') {
          return {resourceType: type, resourceId: null};
        }

        if (rest.startsWith('/')) {
          const segment = rest.substring(1).split('/')[0].split('?')[0];
          if (segment === 'count') {
            return {resourceType: type, resourceId: null};
          }
          return {resourceType: type, resourceId: segment || null};
        }
      }
    }
    return {resourceType: null, resourceId: null};
  }

  /**
   * 根据 HTTP 方法判断操作类型
   */
  private determineAction(method: string, hasId: boolean): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PATCH':
        return hasId ? 'UPDATE' : 'BATCH_UPDATE';
      case 'PUT':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return method;
    }
  }

  /**
   * 脱敏处理：将敏感字段值替换为 '******'
   */
  private sanitize(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const copy = Array.isArray(data) ? [...data] : {...data};
    for (const field of SENSITIVE_FIELDS) {
      if (field in copy) {
        copy[field] = '******';
      }
    }
    return copy;
  }

  /**
   * 从 CREATE 操作的返回值中提取新资源的主键 ID
   */
  private extractCreatedId(result: any): string | undefined {
    if (!result || typeof result !== 'object') return undefined;
    return (
      result.employee_id ??
      result.role_id?.toString() ??
      result.dept_id?.toString() ??
      result.plant_id?.toString() ??
      result.region_id?.toString() ??
      undefined
    );
  }

  /**
   * 获取资源被修改/删除前的数据快照
   */
  private async fetchOldValue(
    ctx: InvocationContext,
    resourceType: string,
    resourceId: string,
  ): Promise<string | undefined> {
    const repoKey = REPO_BINDINGS[resourceType];
    if (!repoKey) return undefined;

    try {
      const repo = await ctx.get<any>(repoKey);

      const id =
        resourceType === 'Employee'
          ? resourceId
          : parseInt(resourceId, 10);

      if (resourceType !== 'Employee' && isNaN(id as number)) {
        return undefined;
      }

      const entity = await repo.findById(id);
      return JSON.stringify(this.sanitize(entity));
    } catch {
      return undefined;
    }
  }
}
