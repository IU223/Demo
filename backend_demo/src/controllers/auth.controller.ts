import { post, requestBody, response, ResponseObject } from '@loopback/rest';
import { repository } from '@loopback/repository';
import { EmployeeRepository } from '../repositories';
const LOGIN_RESPONSE: ResponseObject = {
  description: 'Login response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { type: 'object' },
        },
      },
    },
  },
};

export class AuthController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
  ) { }

  @post('/login')
  @response(200, LOGIN_RESPONSE)
  async login(
    @requestBody({
      description: 'Credentials',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['username', 'password'],
          },
        },
      },
    })
    credentials: { username: string; password: string },
  ) {
    const { username, password } = credentials;

    // 使用 findOne 避免 findById 抛出异常
    const employee = await this.employeeRepository.findOne({ where: { employee_id: username } });
    // 简单明文密码比较（示例）。生产环境请改为哈希验证
    if (employee?.password === password) {
      const user = {
        employee_id: employee.employee_id,
        name: employee.name,
      };
      return {
        token: 'demo-token',
        user,
      };
    }

    throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
  }
}
