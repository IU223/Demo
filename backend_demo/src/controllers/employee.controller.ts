import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Employee } from '../models';
import { EmployeeRepository } from '../repositories';

export class EmployeeControllerController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
  ) { }

  @post('/employees')
  @response(200, {
    description: 'Employee model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Employee) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, {
            title: 'NewEmployee',
          }),
        },
      },
    })
    employee: Employee,
  ): Promise<Employee> {
    try {
      console.log('========= POST /employees 请求体 =========');
      console.log(JSON.stringify(employee, null, 2));
      const result = await this.employeeRepository.create(employee);
      console.log('========= 创建成功 =========');
      return result;
    } catch (err) {
      console.error('========= POST /employees 报错 =========');
      console.error('请求体:', JSON.stringify(employee, null, 2));
      console.error('错误信息:', err.message);
      console.error('错误详情:', JSON.stringify(err.details ?? err, null, 2));
      console.error('完整堆栈:', err.stack);
      throw err; // 继续抛出，让前端也能收到错误
    }
  }

  @get('/employees/count')
  @response(200, {
    description: 'Employee model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Employee) where?: Where<Employee>,
  ): Promise<Count> {
    return this.employeeRepository.count(where);
  }

  @get('/employees')
  @response(200, {
    description: 'Array of Employee model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Employee, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Employee) filter?: Filter<Employee>,
  ): Promise<Employee[]> {
    // ★ 加上这行，查看后端实际收到的 filter
    console.log('========= 后端收到的 filter =========');
    console.log(JSON.stringify(filter, null, 2));
    return this.employeeRepository.find(filter);
  }

  @patch('/employees')
  @response(200, {
    description: 'Employee PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, { partial: true }),
        },
      },
    })
    employee: Employee,
    @param.where(Employee) where?: Where<Employee>,
  ): Promise<Count> {
    return this.employeeRepository.updateAll(employee, where);
  }

  @get('/employees/{id}')
  @response(200, {
    description: 'Employee model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Employee, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Employee, { exclude: 'where' }) filter?: FilterExcludingWhere<Employee>
  ): Promise<Employee> {
    return this.employeeRepository.findById(id, filter);
  }

  @patch('/employees/{id}')
  @response(204, {
    description: 'Employee PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, { partial: true }),
        },
      },
    })
    employee: Employee,
  ): Promise<void> {
    await this.employeeRepository.updateById(id, employee);
  }

  @put('/employees/{id}')
  @response(204, {
    description: 'Employee PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() employee: Employee,
  ): Promise<void> {
    await this.employeeRepository.replaceById(id, employee);
  }

  @del('/employees/{id}')
  @response(204, {
    description: 'Employee DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.employeeRepository.deleteById(id);
  }

}
