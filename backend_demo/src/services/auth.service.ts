import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  EmployeeRepository,
  RoleRepository,
  AuditLogRepository,
} from '../repositories';
import {AuditLog} from '../models';
import {comparePassword, hashPassword} from './hash.service';
import {generateToken, verifyToken} from './jwt.service';

/**
 * 登录成功返回
 */
export interface LoginResult {
  token: string;
  user: {
    employee_id: string;
    name?: string;
    role_id?: number;
    is_super_admin: boolean;
    home_page_auth: number;
    report_page_auth: number;
    auth_page_auth: number;
    log_page_auth: number;
  };
}

/**
 * 认证服务
 *
 * 职责：
 *   1. 登录（员工查找、密码校验、角色查询、JWT 签发、审计日志）
 *   2. 修改密码（原密码校验、新密码哈希、审计日志）
 *   3. 忘记密码/重置密码（员工查找、新密码哈希、审计日志）
 *
 * 审计日志采用 fire-and-forget 模式，不阻塞主流程返回。
 */
@injectable()
export class AuthService {
  constructor(
    @repository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
    @repository(RoleRepository)
    private roleRepository: RoleRepository,
    @repository(AuditLogRepository)
    private auditLogRepository: AuditLogRepository,
  ) {}

  // ==================== 审计日志 ====================

  /** 异步写入审计日志（Fire-and-forget） */
  private writeAuditLog(log: Partial<AuditLog>): void {
    this.auditLogRepository
      .create(log as AuditLog)
      .catch(err => {
        console.error('[AuditLog] 认证日志写入失败:', err);
      });
  }

  // ==================== 登录 ====================

  /**
   * 登录
   * @returns 包含 JWT token 和用户信息的 LoginResult
   */
  async login(
    username: string,
    password: string,
    ip: string,
  ): Promise<LoginResult> {
    // 1. 查找用户
    const employee = await this.employeeRepository.findOne({
      where: {employee_id: username},
    });

    if (!employee || !employee.password) {
      this.writeAuditLog({
        operator_id: username,
        action: 'LOGIN_FAILED',
        resource_type: 'Session',
        request_method: 'POST',
        request_path: '/login',
        ip_address: ip,
        new_value: JSON.stringify({username}),
        status_code: 401,
        error_message: '用户名或密码错误（用户不存在）',
      });
      throw Object.assign(new Error('用户名或密码错误'), {statusCode: 401});
    }

    // 2. 检查 hasaccess 登录系统权限
    if (employee.hasaccess === false) {
      this.writeAuditLog({
        operator_id: username,
        operator_name: employee.name,
        action: 'LOGIN_FAILED',
        resource_type: 'Session',
        request_method: 'POST',
        request_path: '/login',
        ip_address: ip,
        new_value: JSON.stringify({username}),
        status_code: 403,
        error_message: '该用户没有登录系统的权限',
      });
      throw Object.assign(
        new Error('您没有登录此系统的权限，请联系管理员'),
        {statusCode: 403},
      );
    }

    // 3. bcrypt 比对密码
    const isMatch = await comparePassword(password, employee.password);
    if (!isMatch) {
      this.writeAuditLog({
        operator_id: username,
        operator_name: employee.name,
        action: 'LOGIN_FAILED',
        resource_type: 'Session',
        request_method: 'POST',
        request_path: '/login',
        ip_address: ip,
        new_value: JSON.stringify({username}),
        status_code: 401,
        error_message: '用户名或密码错误（密码不匹配）',
      });
      throw Object.assign(new Error('用户名或密码错误'), {statusCode: 401});
    }

    // 4. 查询角色获取 is_super_admin 和页面权限
    let isSuperAdmin = false;
    let homePageAuth = 0;
    let reportPageAuth = 0;
    let authPageAuth = 0;
    let logPageAuth = 0;
    if (employee.role_id != null) {
      try {
        const role = await this.roleRepository.findById(employee.role_id);
        isSuperAdmin = role?.is_super_admin ?? false;
        homePageAuth = role?.home_page_auth ?? 0;
        reportPageAuth = role?.report_page_auth ?? 0;
        authPageAuth = role?.auth_page_auth ?? 0;
        logPageAuth = role?.log_page_auth ?? 0;
      } catch {
        // 角色不存在，默认非超级管理员，无页面权限
      }
    }

    // 5. 签发 JWT（包含页面权限位掩码）
    const token = generateToken({
      employee_id: employee.employee_id,
      name: employee.name,
      role_id: employee.role_id,
      is_super_admin: isSuperAdmin,
      home_page_auth: homePageAuth,
      report_page_auth: reportPageAuth,
      auth_page_auth: authPageAuth,
      log_page_auth: logPageAuth,
    });

    // 6. 登录成功日志
    this.writeAuditLog({
      operator_id: employee.employee_id,
      operator_name: employee.name,
      action: 'LOGIN',
      resource_type: 'Session',
      resource_id: employee.employee_id,
      request_method: 'POST',
      request_path: '/login',
      ip_address: ip,
      new_value: JSON.stringify({
        employee_id: employee.employee_id,
        name: employee.name,
        role_id: employee.role_id,
        is_super_admin: isSuperAdmin,
      }),
      status_code: 200,
    });

    return {
      token,
      user: {
        employee_id: employee.employee_id,
        name: employee.name,
        role_id: employee.role_id,
        is_super_admin: isSuperAdmin,
        home_page_auth: homePageAuth,
        report_page_auth: reportPageAuth,
        auth_page_auth: authPageAuth,
        log_page_auth: logPageAuth,
      },
    };
  }

  // ==================== 修改密码 ====================

  /**
   * 修改密码（需验证 JWT，确认身份后校验原密码）
   * @param token 原始 Bearer token 字符串（不含 "Bearer " 前缀）
   * @param oldPassword 原密码
   * @param newPassword 新密码
   * @param ip 客户端 IP
   */
  async changePassword(
    token: string,
    oldPassword: string,
    newPassword: string,
    ip: string,
  ): Promise<{success: boolean; message: string}> {
    // 1. 从 JWT 中提取当前登录用户
    const decoded = verifyToken(token);
    const employeeId = decoded.employee_id;

    // 2. 查找用户
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee || !employee.password) {
      this.writeAuditLog({
        operator_id: employeeId,
        operator_name: decoded.name,
        action: 'PASSWORD_CHANGE',
        resource_type: 'Employee',
        resource_id: employeeId,
        request_method: 'POST',
        request_path: '/change-password',
        ip_address: ip,
        status_code: 400,
        error_message: '用户不存在或密码未设置',
      });
      throw Object.assign(new Error('用户不存在或密码未设置'), {statusCode: 400});
    }

    // 3. 验证原密码
    const isMatch = await comparePassword(oldPassword, employee.password);
    if (!isMatch) {
      this.writeAuditLog({
        operator_id: employeeId,
        operator_name: employee.name,
        action: 'PASSWORD_CHANGE',
        resource_type: 'Employee',
        resource_id: employeeId,
        request_method: 'POST',
        request_path: '/change-password',
        ip_address: ip,
        status_code: 400,
        error_message: '原密码不正确',
      });
      throw Object.assign(new Error('原密码不正确'), {statusCode: 400});
    }

    // 4. 校验新密码长度
    if (!newPassword || newPassword.length < 6) {
      throw Object.assign(new Error('新密码长度不能少于6位'), {statusCode: 400});
    }

    // 5. 哈希新密码并更新
    const hashedNewPassword = await hashPassword(newPassword);
    await this.employeeRepository.updateById(employeeId, {
      password: hashedNewPassword,
    });

    // 6. 修改密码成功日志
    this.writeAuditLog({
      operator_id: employeeId,
      operator_name: employee.name,
      action: 'PASSWORD_CHANGE',
      resource_type: 'Employee',
      resource_id: employeeId,
      request_method: 'POST',
      request_path: '/change-password',
      ip_address: ip,
      new_value: JSON.stringify({password: '******'}),
      status_code: 200,
    });

    return {success: true, message: '密码修改成功'};
  }

  // ==================== 忘记密码 ====================

  /**
   * 忘记密码 / 重置密码（无需登录态）
   * @param username 工号
   * @param newPassword 新密码
   * @param ip 客户端 IP
   */
  async forgotPassword(
    username: string,
    newPassword: string,
    ip: string,
  ): Promise<{success: boolean; message: string}> {
    // 1. 查找用户
    const employee = await this.employeeRepository.findOne({
      where: {employee_id: username},
    });

    if (!employee) {
      this.writeAuditLog({
        operator_id: username,
        action: 'PASSWORD_RESET',
        resource_type: 'Employee',
        resource_id: username,
        request_method: 'POST',
        request_path: '/forgot-password',
        ip_address: ip,
        new_value: JSON.stringify({username}),
        status_code: 400,
        error_message: '该工号不存在',
      });
      throw Object.assign(new Error('该工号不存在'), {statusCode: 400});
    }

    // 2. 校验新密码长度
    if (!newPassword || newPassword.length < 6) {
      throw Object.assign(new Error('新密码长度不能少于6位'), {statusCode: 400});
    }

    // 3. 哈希新密码并更新
    const hashedNewPassword = await hashPassword(newPassword);
    await this.employeeRepository.updateById(username, {
      password: hashedNewPassword,
    });

    // 4. 忘记密码成功日志
    this.writeAuditLog({
      operator_id: username,
      operator_name: employee.name,
      action: 'PASSWORD_RESET',
      resource_type: 'Employee',
      resource_id: username,
      request_method: 'POST',
      request_path: '/forgot-password',
      ip_address: ip,
      new_value: JSON.stringify({username, password: '******'}),
      status_code: 200,
    });

    return {success: true, message: '密码重置成功'};
  }
}
