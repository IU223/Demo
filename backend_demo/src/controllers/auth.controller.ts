import { inject } from '@loopback/core';
import {
  post,
  requestBody,
  response,
  ResponseObject,
  RestBindings,
  Request,
} from '@loopback/rest';
import { repository } from '@loopback/repository';
import {
  EmployeeRepository,
  RoleRepository,
  AuditLogRepository,
} from '../repositories';
import { AuditLog } from '../models';
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
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) { }

  // ==================== 工具方法 ====================

  /** 获取客户端 IP */
  private getClientIp(): string {
    return (
      this.request.ip ??
      this.request.socket?.remoteAddress ??
      'unknown'
    );
  }

  /** 异步写入审计日志（Fire-and-forget，不阻塞主请求） */
  private writeAuditLog(log: Partial<AuditLog>): void {
    this.auditLogRepository
      .create(log as AuditLog)
      .catch(err => {
        console.error('[AuditLog] 认证日志写入失败:', err);
      });
  }

  // ==================== POST /login ====================

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
    const ip = this.getClientIp();

    // 1. 查找用户
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: username },
    });

    if (!employee || !employee.password) {
      // ★ 登录失败日志
      this.writeAuditLog({
        operator_id: username,
        operator_name: undefined,
        action: 'LOGIN_FAILED',
        resource_type: 'Session',
        resource_id: undefined,
        request_method: 'POST',
        request_path: '/login',
        ip_address: ip,
        old_value: undefined,
        new_value: JSON.stringify({ username }),
        status_code: 401,
        error_message: '用户名或密码错误（用户不存在）',
      });

      throw Object.assign(new Error('用户名或密码错误'), { statusCode: 401 });
    }

    // 2. bcrypt 比对密码
    const isMatch = await comparePassword(password, employee.password);
    if (!isMatch) {
      // ★ 登录失败日志
      this.writeAuditLog({
        operator_id: username,
        operator_name: employee.name,
        action: 'LOGIN_FAILED',
        resource_type: 'Session',
        resource_id: undefined,
        request_method: 'POST',
        request_path: '/login',
        ip_address: ip,
        old_value: undefined,
        new_value: JSON.stringify({ username }),
        status_code: 401,
        error_message: '用户名或密码错误（密码不匹配）',
      });

      throw Object.assign(new Error('用户名或密码错误'), { statusCode: 401 });
    }

    // 3. 查询角色获取 is_super_admin
    let isSuperAdmin = false;
    if (employee.role_id != null) {
      try {
        const role = await this.roleRepository.findById(employee.role_id);
        isSuperAdmin = role?.is_super_admin ?? false;
      } catch {
        // 角色不存在，默认非超级管理员
      }
    }

    // 4. 签发 JWT
    const token = generateToken({
      employee_id: employee.employee_id,
      name: employee.name,
      role_id: employee.role_id,
      is_super_admin: isSuperAdmin,
    });

    // ★ 登录成功日志
    this.writeAuditLog({
      operator_id: employee.employee_id,
      operator_name: employee.name,
      action: 'LOGIN',
      resource_type: 'Session',
      resource_id: employee.employee_id,
      request_method: 'POST',
      request_path: '/login',
      ip_address: ip,
      old_value: undefined,
      new_value: JSON.stringify({
        employee_id: employee.employee_id,
        name: employee.name,
        role_id: employee.role_id,
        is_super_admin: isSuperAdmin,
      }),
      status_code: 200,
      error_message: undefined,
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

  // ==================== POST /change-password ====================

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
    const ip = this.getClientIp();

    // 1. 从 JWT 中提取当前登录用户
    const authHeader = this.request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw Object.assign(new Error('未提供有效的认证令牌'), { statusCode: 401 });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    const employeeId = decoded.employee_id;

    // 2. 查找用户
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee || !employee.password) {
      // ★ 修改密码失败日志
      this.writeAuditLog({
        operator_id: employeeId,
        operator_name: decoded.name,
        action: 'PASSWORD_CHANGE',
        resource_type: 'Employee',
        resource_id: employeeId,
        request_method: 'POST',
        request_path: '/change-password',
        ip_address: ip,
        old_value: undefined,
        new_value: undefined,
        status_code: 400,
        error_message: '用户不存在或密码未设置',
      });

      throw Object.assign(new Error('用户不存在或密码未设置'), {
        statusCode: 400,
      });
    }

    // 3. 验证原密码
    const isMatch = await comparePassword(body.oldPassword, employee.password);
    if (!isMatch) {
      // ★ 修改密码失败日志（原密码错误）
      this.writeAuditLog({
        operator_id: employeeId,
        operator_name: employee.name,
        action: 'PASSWORD_CHANGE',
        resource_type: 'Employee',
        resource_id: employeeId,
        request_method: 'POST',
        request_path: '/change-password',
        ip_address: ip,
        old_value: undefined,
        new_value: undefined,
        status_code: 400,
        error_message: '原密码不正确',
      });

      throw Object.assign(new Error('原密码不正确'), { statusCode: 400 });
    }

    // 4. 校验新密码长度
    if (!body.newPassword || body.newPassword.length < 6) {
      throw Object.assign(new Error('新密码长度不能少于6位'), {
        statusCode: 400,
      });
    }

    // 5. 哈希新密码并更新
    const hashedNewPassword = await hashPassword(body.newPassword);
    await this.employeeRepository.updateById(employeeId, {
      password: hashedNewPassword,
    });

    // ★ 修改密码成功日志（不记录密码明文）
    this.writeAuditLog({
      operator_id: employeeId,
      operator_name: employee.name,
      action: 'PASSWORD_CHANGE',
      resource_type: 'Employee',
      resource_id: employeeId,
      request_method: 'POST',
      request_path: '/change-password',
      ip_address: ip,
      old_value: undefined,
      new_value: JSON.stringify({ password: '******' }),
      status_code: 200,
      error_message: undefined,
    });

    return { success: true, message: '密码修改成功' };
  }

  // ==================== POST /forgot-password ====================

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
    const ip = this.getClientIp();

    // 1. 查找用户
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: body.username },
    });

    if (!employee) {
      // ★ 忘记密码失败日志
      this.writeAuditLog({
        operator_id: body.username,
        operator_name: undefined,
        action: 'PASSWORD_RESET',
        resource_type: 'Employee',
        resource_id: body.username,
        request_method: 'POST',
        request_path: '/forgot-password',
        ip_address: ip,
        old_value: undefined,
        new_value: JSON.stringify({ username: body.username }),
        status_code: 400,
        error_message: '该工号不存在',
      });

      throw Object.assign(new Error('该工号不存在'), { statusCode: 400 });
    }

    // 2. 校验新密码长度
    if (!body.newPassword || body.newPassword.length < 6) {
      throw Object.assign(new Error('新密码长度不能少于6位'), {
        statusCode: 400,
      });
    }

    // 3. 哈希新密码并更新
    const hashedNewPassword = await hashPassword(body.newPassword);
    await this.employeeRepository.updateById(body.username, {
      password: hashedNewPassword,
    });

    // ★ 忘记密码成功日志（不记录密码明文）
    this.writeAuditLog({
      operator_id: body.username,
      operator_name: employee.name,
      action: 'PASSWORD_RESET',
      resource_type: 'Employee',
      resource_id: body.username,
      request_method: 'POST',
      request_path: '/forgot-password',
      ip_address: ip,
      old_value: undefined,
      new_value: JSON.stringify({
        username: body.username,
        password: '******',
      }),
      status_code: 200,
      error_message: undefined,
    });

    return { success: true, message: '密码重置成功' };
  }

  // ==================== POST /hash-password ====================

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
