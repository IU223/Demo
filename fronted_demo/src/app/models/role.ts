/** 角色详情接口 */
export interface RoleDetail {
  role_id: number;
  role_name: string;
  description?: string;
  home_page_auth: number;
  report_page_auth: number;
  auth_page_auth: number;
  is_super_admin?: boolean;   // ★ Task 8 新增
  created_at?: string;
  updated_at?: string;
}

/** 页面权限字段类型 */
export type PageAuthField = 'home_page_auth' | 'report_page_auth' | 'auth_page_auth';

/** 页面权限表格行（用于 UI 渲染） */
export interface PagePermRow {
  label: string;
  field: PageAuthField;
  read: boolean;
  create: boolean;
  delete: boolean;
  update: boolean;
}
