/** 审计日志接口 */
export interface AuditLog {
  log_id?: number;
  operator_id: string;
  operator_name?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  request_method: string;
  request_path: string;
  ip_address?: string;
  old_value?: string;    // JSON string
  new_value?: string;    // JSON string
  status_code?: number;
  error_message?: string;
  created_at?: string;
}

/** 操作类型枚举（用于下拉筛选和 Tag 颜色映射） */
export const ACTION_OPTIONS: { label: string; value: string }[] = [
  { label: '新增', value: 'CREATE' },
  { label: '修改', value: 'UPDATE' },
  // { label: '删除', value: 'DELETE' },
  { label: '批量修改', value: 'BATCH_UPDATE' },
  // { label: '批量删除', value: 'BATCH_DELETE' },
  { label: '登录成功', value: 'LOGIN' },
  { label: '登录失败', value: 'LOGIN_FAILED' },
  { label: '登出', value: 'LOGOUT' },
  { label: '修改密码', value: 'PASSWORD_CHANGE' },
  { label: '重置密码', value: 'PASSWORD_RESET' },
];

/** 资源类型枚举 */
export const RESOURCE_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Employee', value: 'Employee' },
  { label: 'Role', value: 'Role' },
  { label: 'Session', value: 'Session' },
];

/** 操作类型 → Tag 颜色映射 */
export const ACTION_TAG_COLOR: Record<string, string> = {
  CREATE: 'green',
  UPDATE: 'blue',
  BATCH_UPDATE: 'blue',
  DELETE: 'red',
  BATCH_DELETE: 'red',
  LOGIN: 'cyan',
  LOGIN_FAILED: 'orange',
  LOGOUT: 'default',
  PASSWORD_CHANGE: 'purple',
  PASSWORD_RESET: 'magenta',
};

/** 操作类型 → 中文标签 */
export const ACTION_LABEL: Record<string, string> = {
  CREATE: '新增',
  UPDATE: '修改',
  BATCH_UPDATE: '批量修改',
  // DELETE: '删除',
  // BATCH_DELETE: '批量删除',
  LOGIN: '登录成功',
  LOGIN_FAILED: '登录失败',
  LOGOUT: '登出',
  PASSWORD_CHANGE: '修改密码',
  PASSWORD_RESET: '重置密码',
};
