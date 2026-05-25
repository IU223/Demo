import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  response,
  RestBindings,
  Request,
} from '@loopback/rest';
import {AuditLog} from '../models';
import {AuditLogRepository} from '../repositories';
import {CurrentUserProfile} from '../interceptors/auth.interceptor';

export class AuditLogController {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) {}

  // ==================== 工具方法 ====================

  /** 从 request 获取当前用户信息（由 AuthInterceptor 挂载） */
  private getCurrentUser(): CurrentUserProfile | undefined {
    return (this.request as any).currentUser;
  }

  /**
   * 根据用户身份自动注入 where 过滤条件
   *   - 超级管理员：不做限制，可查看全部日志
   *   - 普通用户：仅可查看 operator_id === 自己工号 的日志
   */
  private applyUserFilter(where?: Where<AuditLog>): Where<AuditLog> {
    const user = this.getCurrentUser();
    if (!user) {
      throw Object.assign(new Error('未登录'), {statusCode: 401});
    }

    // 超级管理员 → 不做限制
    if (user.is_super_admin) {
      return where ?? {};
    }

    // 普通用户 → 强制追加 operator_id 过滤
    const userWhere = {operator_id: user.employee_id};

    if (where && Object.keys(where).length > 0) {
      return {and: [userWhere, where]} as Where<AuditLog>;
    }

    return userWhere as Where<AuditLog>;
  }

  // ==================== GET 端点 ====================

  @get('/audit-logs/count')
  @response(200, {
    description: 'AuditLog model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AuditLog) where?: Where<AuditLog>,
  ): Promise<Count> {
    const filteredWhere = this.applyUserFilter(where);
    return this.auditLogRepository.count(filteredWhere);
  }

  @get('/audit-logs')
  @response(200, {
    description: 'Array of AuditLog model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AuditLog, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AuditLog) filter?: Filter<AuditLog>,
  ): Promise<AuditLog[]> {
    const filteredWhere = this.applyUserFilter(filter?.where);

    filter = {
      ...(filter || {}),
      where: filteredWhere,
    };

    // 默认按 created_at 倒序
    if (!filter.order) {
      filter.order = ['created_at DESC'];
    }

    return this.auditLogRepository.find(filter);
  }

  @get('/audit-logs/{id}')
  @response(200, {
    description: 'AuditLog model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AuditLog, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AuditLog, {exclude: 'where'})
    filter?: FilterExcludingWhere<AuditLog>,
  ): Promise<AuditLog> {
    const log = await this.auditLogRepository.findById(id, filter);

    // 普通用户只能查看自己的日志详情
    const user = this.getCurrentUser();
    if (!user) {
      throw Object.assign(new Error('未登录'), {statusCode: 401});
    }
    if (!user.is_super_admin && log.operator_id !== user.employee_id) {
      throw Object.assign(
        new Error('您只能查看自己的操作日志'),
        {statusCode: 403},
      );
    }

    return log;
  }
}
