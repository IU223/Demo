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
import { hashPassword } from '../services/hash.service';
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
          schema: getModelSchemaRef(Employee, { title: 'NewEmployee' }),
        },
      },
    })
    employee: Employee,
  ): Promise<Employee> {
    // ★ 创建时自动哈希密码
    if (employee.password) {
      employee.password = await hashPassword(employee.password);
    }

    console.log('========= POST /employees =========');
    const result = await this.employeeRepository.create(employee);
    console.log('========= 创建成功 =========');
    return result;
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
