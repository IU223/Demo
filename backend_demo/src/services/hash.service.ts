import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * 将明文密码哈希化
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 比对明文密码与哈希值
 */
export async function comparePassword(
  plainText: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}
