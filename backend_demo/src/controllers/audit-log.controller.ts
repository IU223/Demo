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
   * 鉴权：仅超级管理员可访问
   * P2 阶段可扩展为：超管 OR 拥有 log_page_auth READ 权限
   */
  private assertCanRead(): void {
    const user = this.getCurrentUser();
    if (!user?.is_super_admin) {
      throw Object.assign(
        new Error('仅超级管理员可查看操作日志'),
        {statusCode: 403},
      );
    }
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
    this.assertCanRead();
    return this.auditLogRepository.count(where);
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
    this.assertCanRead();

    // 默认按 created_at 倒序，如果调用方未指定 order
    if (!filter?.order) {
      filter = {...(filter || {}), order: ['created_at DESC']};
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
    this.assertCanRead();
    return this.auditLogRepository.findById(id, filter);
  }
}
