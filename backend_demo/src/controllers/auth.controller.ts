import { post, requestBody, response, ResponseObject } from '@loopback/rest';
import { repository } from '@loopback/repository';
import { EmployeeRepository } from '../repositories';
import { comparePassword, hashPassword } from '../services/hash.service';
import { generateToken } from '../services/jwt.service';

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

  /**
   * POST /login
   * 使用 bcrypt 比对密码，成功后签发 JWT
   */
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

    // 1. 查找用户
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: username },
    });

    if (!employee || !employee.password) {
      throw Object.assign(new Error('用户名或密码错误'), { statusCode: 401 });
    }

    // 2. bcrypt 比对密码
    const isMatch = await comparePassword(password, employee.password);
    if (!isMatch) {
      throw Object.assign(new Error('用户名或密码错误'), { statusCode: 401 });
    }

    // 3. 签发 JWT
    const token = generateToken({
      employee_id: employee.employee_id,
      name: employee.name,
      role_id: employee.role_id,
    });

    return {
      token,
      user: {
        employee_id: employee.employee_id,
        name: employee.name,
        role_id: employee.role_id,
      },
    };
  }

  /**
   * POST /register  （可选：注册/重置密码时使用）
   * 仅作演示，生产环境需加权限控制
   */
  @post('/hash-password')
  @response(200, {
    description: 'Hash a plain-text password (utility endpoint)',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async hashPwd(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { password: { type: 'string' } },
            required: ['password'],
          },
        },
      },
    })
    body: { password: string },
  ) {
    const hashed = await hashPassword(body.password);
    return { hashedPassword: hashed };
  }
}
