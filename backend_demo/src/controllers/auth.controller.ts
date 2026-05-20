import { inject } from '@loopback/core';
import {
  post, requestBody, response, ResponseObject,
  RestBindings, Request,
} from '@loopback/rest';
import { repository } from '@loopback/repository';
import { EmployeeRepository, RoleRepository } from '../repositories';
import { comparePassword, hashPassword } from '../services/hash.service';
import { generateToken, verifyToken } from '../services/jwt.service';

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

// ★ 新增：修改密码响应
const CHANGE_PASSWORD_RESPONSE: ResponseObject = {
  description: 'Change password response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
    },
  },
};

export class AuthController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    // ★ Task 3 新增：注入 RoleRepository 以查询 is_super_admin
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
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

    // ★ 3. 查询角色获取 is_super_admin
    let isSuperAdmin = false;
    if (employee.role_id != null) {
      try {
        const role = await this.roleRepository.findById(employee.role_id);
        isSuperAdmin = role?.is_super_admin ?? false;
      } catch {
        // 角色不存在，默认非超级管理员
      }
    }

    // 4. 签发 JWT（包含 is_super_admin）
    const token = generateToken({
      employee_id: employee.employee_id,
      name: employee.name,
      role_id: employee.role_id,
      is_super_admin: isSuperAdmin,
    });

    return {
      token,
      user: {
        employee_id: employee.employee_id,
        name: employee.name,
        role_id: employee.role_id,
        is_super_admin: isSuperAdmin,
      },
    };
  }

  // ===================== ★ 新增：修改密码 =====================

  /**
   * POST /change-password
   * 需要 JWT 认证（拦截器已自动校验 token）
   * 从 Authorization header 中解析当前用户，验证原密码后更新新密码
   */
  @post('/change-password')
  @response(200, CHANGE_PASSWORD_RESPONSE)
  async changePassword(
    @requestBody({
      description: 'Change password payload',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: { type: 'string' },
              newPassword: { type: 'string' },
            },
            required: ['oldPassword', 'newPassword'],
          },
        },
      },
    })
    body: { oldPassword: string; newPassword: string },
  ): Promise<{ success: boolean; message: string }> {

    // 1. 从 JWT 中提取当前登录用户的 employee_id
    const authHeader = this.request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw Object.assign(new Error('未提供有效的认证令牌'), { statusCode: 401 });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    const employeeId = decoded.employee_id;

    console.log(`[change-password] 用户 ${employeeId} 请求修改密码`);

    // 2. 查找用户
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee || !employee.password) {
      throw Object.assign(new Error('用户不存在或密码未设置'), { statusCode: 400 });
    }

    // 3. 验证原密码
    const isMatch = await comparePassword(body.oldPassword, employee.password);
    if (!isMatch) {
      throw Object.assign(new Error('原密码不正确'), { statusCode: 400 });
    }

    // 4. 校验新密码长度
    if (!body.newPassword || body.newPassword.length < 6) {
      throw Object.assign(new Error('新密码长度不能少于6位'), { statusCode: 400 });
    }

    // 5. 哈希新密码并更新
    const hashedNewPassword = await hashPassword(body.newPassword);
    await this.employeeRepository.updateById(employeeId, {
      password: hashedNewPassword,
    });

    console.log(`[change-password] 用户 ${employeeId} 密码修改成功`);

    return { success: true, message: '密码修改成功' };
  }

  /**
   * POST /forgot-password
   * 公开端点（无需 JWT），用于忘记密码时重置密码
   * 通过 username（工号）查找用户并更新新密码
   */
  @post('/forgot-password')
  @response(200, CHANGE_PASSWORD_RESPONSE)
  async forgotPassword(
    @requestBody({
      description: 'Forgot password payload',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              newPassword: { type: 'string' },
            },
            required: ['username', 'newPassword'],
          },
        },
      },
    })
    body: { username: string; newPassword: string },
  ): Promise<{ success: boolean; message: string }> {

    console.log(`[forgot-password] 用户 ${body.username} 请求重置密码`);

    // 1. 查找用户
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: body.username },
    });

    if (!employee) {
      throw Object.assign(new Error('该工号不存在'), { statusCode: 400 });
    }

    // 2. 校验新密码长度
    if (!body.newPassword || body.newPassword.length < 6) {
      throw Object.assign(new Error('新密码长度不能少于6位'), { statusCode: 400 });
    }

    // 3. 哈希新密码并更新
    const hashedNewPassword = await hashPassword(body.newPassword);
    await this.employeeRepository.updateById(body.username, {
      password: hashedNewPassword,
    });

    console.log(`[forgot-password] 用户 ${body.username} 密码重置成功`);

    return { success: true, message: '密码重置成功' };
  }

  /**
   * POST /hash-password （工具端点）
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
