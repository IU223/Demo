import {
  Count, CountSchema, Filter, FilterExcludingWhere,
  repository, Where,
} from '@loopback/repository';
import {
  post, param, get, getModelSchemaRef, patch, put, del,
  requestBody, response,
} from '@loopback/rest';
import { Role } from '../models';
import { RoleRepository, EmployeeRepository } from '../repositories'; // ★ 新增 EmployeeRepository

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    // ★ 新增：注入 EmployeeRepository 用于删除前绑定检查
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
  ) { }

  // ★ 修改：创建时自动分配 role_id（若未提供）
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
    // ★ 自动分配 role_id
    if (role.role_id == null) {
      const maxRoles = await this.roleRepository.find({
        order: ['role_id DESC'],
        limit: 1,
      });
      role.role_id = maxRoles.length > 0 ? (maxRoles[0].role_id ?? 0) + 1 : 1;
    }
    return this.roleRepository.create(role);
  }

  @get('/roles/count')
  @response(200, {
    description: 'Role model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
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
    return this.roleRepository.find(filter);
  }

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
    return this.roleRepository.updateAll(role, where);
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
    return this.roleRepository.findById(id, filter);
  }

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
    await this.roleRepository.replaceById(id, role);
  }

  // ★ 修改：删除前检查是否有员工绑定该角色
  @del('/roles/{id}')
  @response(204, {
    description: 'Role DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
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
