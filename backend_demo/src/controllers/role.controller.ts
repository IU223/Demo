import { inject } from '@loopback/core';
import {
  Count, CountSchema, Filter, FilterExcludingWhere,
  repository, Where,
} from '@loopback/repository';
import {
  post, param, get, getModelSchemaRef, patch, put, del,
  requestBody, response,
  RestBindings, Request,
} from '@loopback/rest';
import { Role } from '../models';
import { RoleRepository, EmployeeRepository } from '../repositories';
import { CurrentUserProfile } from '../interceptors/auth.interceptor';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    // ★ Task 5 新增：注入 HTTP Request 以获取当前用户信息
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) { }

  // ==================== ★ 工具方法 ====================

  /** 从 request 获取当前用户信息（由拦截器在 Task 4 中挂载） */
  private getCurrentUser(): CurrentUserProfile | undefined {
    return (this.request as any).currentUser;
  }

  /** 断言当前用户是超级管理员，否则抛出 403 */
  private assertSuperAdmin(): void {
    const user = this.getCurrentUser();
    if (!user?.is_super_admin) {
      throw Object.assign(
        new Error('仅超级管理员可执行此操作'),
        { statusCode: 403 },
      );
    }
  }

  // ==================== ★ Task 5: 写操作 — 需超级管理员权限 ====================

  @post('/roles')
  @response(200, {
    description: 'Role model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Role) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { title: 'NewRole' }),
        },
      },
    })
    role: Role,
  ): Promise<Role> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();

    // 自动分配 role_id（原有逻辑）
    if (role.role_id == null) {
      const maxRoles = await this.roleRepository.find({
        order: ['role_id DESC'],
        limit: 1,
      });
      role.role_id = maxRoles.length > 0 ? (maxRoles[0].role_id ?? 0) + 1 : 1;
    }
    return this.roleRepository.create(role);
  }

  // ==================== ★ Task 6: 读操作 — 按身份过滤 ====================

  @get('/roles/count')
  @response(200, {
    description: 'Role model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    const user = this.getCurrentUser();
    // ★ 非超级管理员只能统计自己角色
    if (!user?.is_super_admin) {
      where = { role_id: user?.role_id };
    }
    return this.roleRepository.count(where);
  }

  @get('/roles')
  @response(200, {
    description: 'Array of Role model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Role, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Role) filter?: Filter<Role>,
  ): Promise<Role[]> {
    const user = this.getCurrentUser();
    // ★ 非超级管理员只能查看自己的角色
    if (!user?.is_super_admin) {
      const myRoleId = user?.role_id;
      if (myRoleId == null) return [];
      filter = { ...(filter || {}), where: { role_id: myRoleId } };
    }
    return this.roleRepository.find(filter);
  }

  @get('/roles/{id}')
  @response(200, {
    description: 'Role model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Role, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Role, { exclude: 'where' }) filter?: FilterExcludingWhere<Role>,
  ): Promise<Role> {
    const user = this.getCurrentUser();
    // ★ 非超级管理员只能查看自己的角色
    if (!user?.is_super_admin && user?.role_id !== id) {
      throw Object.assign(
        new Error('您只能查看自己的角色'),
        { statusCode: 403 },
      );
    }
    return this.roleRepository.findById(id, filter);
  }

  // ==================== ★ Task 5: 批量更新 — 需超级管理员 ====================

  @patch('/roles')
  @response(200, {
    description: 'Role PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { partial: true }),
        },
      },
    })
    role: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();
    return this.roleRepository.updateAll(role, where);
  }

  // ==================== ★ Task 5 + Task 7: 单条更新 — 含防自锁 ====================

  @patch('/roles/{id}')
  @response(204, {
    description: 'Role PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { partial: true }),
        },
      },
    })
    role: Role,
  ): Promise<void> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();

    // ★ Task 7: 防自锁 — 不允许取消唯一超级管理员的 is_super_admin
    if (role.is_super_admin === false) {
      const existingRole = await this.roleRepository.findById(id);
      if (existingRole.is_super_admin) {
        const superAdminCount = await this.roleRepository.count({ is_super_admin: true });
        if (superAdminCount.count <= 1) {
          throw Object.assign(
            new Error('不可取消：当前是系统中唯一的超级管理员角色'),
            { statusCode: 400 },
          );
        }
      }
    }

    await this.roleRepository.updateById(id, role);
  }

  @put('/roles/{id}')
  @response(204, {
    description: 'Role PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() role: Role,
  ): Promise<void> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();

    // ★ Task 7: 防自锁
    if (role.is_super_admin === false) {
      const existingRole = await this.roleRepository.findById(id);
      if (existingRole.is_super_admin) {
        const superAdminCount = await this.roleRepository.count({ is_super_admin: true });
        if (superAdminCount.count <= 1) {
          throw Object.assign(
            new Error('不可取消：当前是系统中唯一的超级管理员角色'),
            { statusCode: 400 },
          );
        }
      }
    }

    await this.roleRepository.replaceById(id, role);
  }

  // ==================== ★ Task 5 + Task 7: 删除 — 超管鉴权 + 禁删超管角色 ====================

  @del('/roles/{id}')
  @response(204, {
    description: 'Role DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();

    // ★ Task 7: 不允许删除超级管理员角色
    const role = await this.roleRepository.findById(id);
    if (role.is_super_admin) {
      throw Object.assign(
        new Error('不可删除超级管理员角色'),
        { statusCode: 400 },
      );
    }

    // 原有逻辑：检查是否有员工绑定
    const empCount = await this.employeeRepository.count({ role_id: id });
    if (empCount.count > 0) {
      throw Object.assign(
        new Error(`不可删除，已有 ${empCount.count} 位用户绑定该角色，请先解绑再删除`),
        { statusCode: 400 },
      );
    }

    await this.roleRepository.deleteById(id);
  }
}
