import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  response,
  ResponseObject,
  RestBindings,
  Request,
} from '@loopback/rest';
import {hashPassword} from '../services/hash.service';
import {AuthService} from '../services/auth.service';

const LOGIN_RESPONSE: ResponseObject = {
  description: 'Login response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          token: {type: 'string'},
          user: {type: 'object'},
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
          success: {type: 'boolean'},
          message: {type: 'string'},
        },
      },
    },
  },
};

export class AuthController {
  constructor(
    @inject('services.AuthService')
    private authService: AuthService,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) {}

  // ==================== 工具方法 ====================

  /** 获取客户端 IP */
  private getClientIp(): string {
    return (
      this.request.ip ??
      this.request.socket?.remoteAddress ??
      'unknown'
    );
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
              username: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['username', 'password'],
          },
        },
      },
    })
    credentials: {username: string; password: string},
  ) {
    const ip = this.getClientIp();
    return this.authService.login(credentials.username, credentials.password, ip);
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
              oldPassword: {type: 'string'},
              newPassword: {type: 'string'},
            },
            required: ['oldPassword', 'newPassword'],
          },
        },
      },
    })
    body: {oldPassword: string; newPassword: string},
  ): Promise<{success: boolean; message: string}> {
    const ip = this.getClientIp();

    // 从 Authorization 头提取 Bearer token
    const authHeader = this.request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw Object.assign(new Error('未提供有效的认证令牌'), {statusCode: 401});
    }
    const token = authHeader.slice(7);

    return this.authService.changePassword(token, body.oldPassword, body.newPassword, ip);
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
              username: {type: 'string'},
              newPassword: {type: 'string'},
            },
            required: ['username', 'newPassword'],
          },
        },
      },
    })
    body: {username: string; newPassword: string},
  ): Promise<{success: boolean; message: string}> {
    const ip = this.getClientIp();
    return this.authService.forgotPassword(body.username, body.newPassword, ip);
  }

  // ==================== POST /hash-password ====================

  @post('/hash-password')
  @response(200, {
    description: 'Hash a plain-text password (utility endpoint)',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async hashPwd(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {password: {type: 'string'}},
            required: ['password'],
          },
        },
      },
    })
    body: {password: string},
  ) {
    const hashed = await hashPassword(body.password);
    return {hashedPassword: hashed};
  }
}
