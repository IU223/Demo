import { Entity, model, property } from '@loopback/repository';

@model()
export class Role extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  role_id?: number;

  @property({
    type: 'string',
  })
  role_name?: string;

  @property({
    type: 'number',
  })
  home_page_auth?: number;

  @property({
    type: 'number',
  })
  report_page_auth?: number;

  @property({
    type: 'number',
  })
  auth_page_auth?: number;

  @property({
    type: 'string',
  })
  description?: string;

  // ★ Task 2 新增：超级管理员标记
  @property({
    type: 'boolean',
    default: false,
  })
  is_super_admin?: boolean;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
