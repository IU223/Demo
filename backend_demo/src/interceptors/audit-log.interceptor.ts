// src/interceptors/audit-log.interceptor.ts

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
import { AuditLog } from '../models';
import { AuditLogRepository } from '../repositories';

// ==================== 常量配置 ====================

const PATH_RESOURCE_MAP: Record<string, string> = {
  '/employees': 'Employee',
  '/roles': 'Role',
  '/departments': 'Department',
  '/plants': 'Plant',
  '/regions': 'Region',
};

const REPO_BINDINGS: Record<string, string> = {
  Employee: 'repositories.EmployeeRepository',
  Role: 'repositories.RoleRepository',
  Department: 'repositories.DepartmentRepository',
  Plant: 'repositories.PlantRepository',
  Region: 'repositories.RegionRepository',
};

const SKIP_PATHS = [
  '/audit-logs',
  '/login',
  '/forgot-password',
  '/change-password',
  '/hash-password',
  '/ping',
  '/explorer',
  '/openapi.json',
  '/ai',
];

const SENSITIVE_FIELDS = ['password'];

// ==================== 拦截器 ====================

@bind(asGlobalInterceptor('audit'))
export class AuditLogInterceptor implements Provider<Interceptor> {
  value(): Interceptor {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ): Promise<InvocationResult> {
    let req: Request | undefined;
    try {
      req = await invocationCtx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });
    } catch {
      return next();
    }
    if (!req) return next();

    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
      return next();
    }

    if (
      req.path === '/' ||
      req.path === '' ||
      SKIP_PATHS.some(p => req!.path.startsWith(p))
    ) {
      return next();
    }

    const { resourceType, resourceId } = this.parseResource(req.path);
    if (!resourceType) {
      return next();
    }

    let auditLogRepo: AuditLogRepository;
    try {
      auditLogRepo = await invocationCtx.get<AuditLogRepository>(
        'repositories.AuditLogRepository',
      );
    } catch {
      return next();
    }

    // ── 6. ★ 修改：获取变更前的数据快照 ──
    let oldValue: string | undefined;

    if (['PATCH', 'PUT', 'DELETE'].includes(req.method)) {
      if (resourceId) {
        // ── 单条操作：按 ID 获取快照 ──
        oldValue = await this.fetchOldValue(
          invocationCtx,
          resourceType,
          resourceId,
        );
      } else {
        // ── ★ 新增：批量操作（无 ID）：按 where 条件获取所有受影响记录的快照 ──
        oldValue = await this.fetchOldValueBatch(
          invocationCtx,
          resourceType,
          req,
        );
      }
    }

    let result: InvocationResult = undefined;
    let statusCode = 0;
    let errorMessage: string | undefined;

    try {
      result = await next();

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
      const currentUser = (req as any).currentUser;

      let finalResourceId = resourceId;
      if (req.method === 'POST' && !finalResourceId && result) {
        finalResourceId = this.extractCreatedId(result) ?? null;
      }

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
          /* ignore */
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

      auditLogRepo.create(logEntry as AuditLog).catch(err => {
        console.error('[AuditLog] 日志写入失败:', err);
      });
    }

    return result;
  }

  // ==================== 工具方法 ====================

  private parseResource(path: string): {
    resourceType: string | null;
    resourceId: string | null;
  } {
    for (const [prefix, type] of Object.entries(PATH_RESOURCE_MAP)) {
      if (path.startsWith(prefix)) {
        const rest = path.substring(prefix.length);

        if (!rest || rest === '/') {
          return { resourceType: type, resourceId: null };
        }

        if (rest.startsWith('/')) {
          const segment = rest.substring(1).split('/')[0].split('?')[0];
          if (segment === 'count') {
            return { resourceType: type, resourceId: null };
          }
          return { resourceType: type, resourceId: segment || null };
        }
      }
    }
    return { resourceType: null, resourceId: null };
  }

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

  private sanitize(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const copy = Array.isArray(data) ? [...data] : { ...data };
    for (const field of SENSITIVE_FIELDS) {
      if (field in copy) {
        copy[field] = '******';
      }
    }
    return copy;
  }

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

  /** 单条操作：按 ID 获取变更前快照 */
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

  /**
   * ★ 新增：批量操作 — 按 where 条件获取所有受影响记录的快照
   *
   * 解析 URL 中的 where 参数，查询所有匹配的记录作为变更前快照。
   * 对于批量软删除（PATCH /employees?where={employee_id:{inq:[...]}}），
   * 这将捕获所有被"删除"的员工数据。
   */
  /**
 * ★ 修复：批量操作 — 按 where 条件获取所有受影响记录的快照
 */
  private async fetchOldValueBatch(
    ctx: InvocationContext,
    resourceType: string,
    req: Request,
  ): Promise<string | undefined> {
    const repoKey = REPO_BINDINGS[resourceType];
    if (!repoKey) return undefined;

    try {
      const repo = await ctx.get<any>(repoKey);

      // ★ 修复：多种方式尝试获取 where 参数
      let whereParam: string | null = null;

      // 方式 1：从 req.query 获取（Express 已解析的查询参数）
      if ((req as any).query?.where) {
        const raw = (req as any).query.where;
        whereParam = typeof raw === 'string' ? raw : JSON.stringify(raw);
      }

      // 方式 2：如果方式 1 失败，从 URL 手动解析
      if (!whereParam) {
        try {
          const url = new URL(
            req.url,
            `http://${req.headers.host || 'localhost'}`,
          );
          whereParam = url.searchParams.get('where');
        } catch {
          /* ignore */
        }
      }

      // 方式 3：从原始 URL 字符串中正则提取
      if (!whereParam && req.url) {
        const match = req.url.match(/[?&]where=([^&]+)/);
        if (match) {
          whereParam = decodeURIComponent(match[1]);
        }
      }

      if (!whereParam) return undefined;

      const where = typeof whereParam === 'object'
        ? whereParam
        : JSON.parse(whereParam);

      // 查询所有匹配的记录（限制最多 100 条，防止数据量过大）
      const entities = await repo.find({ where, limit: 100 });

      if (!entities || entities.length === 0) return undefined;

      // 对每条记录做脱敏处理
      const sanitizedEntities = entities.map((e: any) => this.sanitize(e));

      // 如果只有一条，直接返回对象；多条则返回数组
      if (sanitizedEntities.length === 1) {
        return JSON.stringify(sanitizedEntities[0]);
      }
      return JSON.stringify(sanitizedEntities);
    } catch (err) {
      console.warn('[AuditLog] 批量获取变更前快照失败:', err);
      return undefined;
    }
  }

}
