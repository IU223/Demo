import * as jwt from 'jsonwebtoken';

// ★ 生产环境请使用环境变量，切勿硬编码
const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY_CHANGE_ME';
const JWT_EXPIRES_IN = '8h'; // token 有效期

export interface JwtPayload {
  employee_id: string;
  name?: string;
  role_id?: number;
  [key: string]: unknown;
}

/**
 * 签发 JWT
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证并解析 JWT，失败则抛出异常
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
