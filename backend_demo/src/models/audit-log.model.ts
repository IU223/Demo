import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {table: 'auditlog'},
    indexes: {
      idx_audit_operator: {keys: {operator_id: 1}},
      idx_audit_created_at: {keys: {created_at: -1}},
      idx_audit_resource: {keys: {resource_type: 1, resource_id: 1}},
      idx_audit_action: {keys: {action: 1}},
    },
  },
})
export class AuditLog extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  log_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  operator_id: string;

  @property({
    type: 'string',
  })
  operator_name?: string;

  @property({
    type: 'string',
    required: true,
  })
  action: string;

  @property({
    type: 'string',
    required: true,
  })
  resource_type: string;

  @property({
    type: 'string',
  })
  resource_id?: string;

  @property({
    type: 'string',
    required: true,
  })
  request_method: string;

  @property({
    type: 'string',
    required: true,
  })
  request_path: string;

  @property({
    type: 'string',
  })
  ip_address?: string;

  @property({
    type: 'string',
    postgresql: {dataType: 'text'},
  })
  old_value?: string;

  @property({
    type: 'string',
    postgresql: {dataType: 'text'},
  })
  new_value?: string;

  @property({
    type: 'number',
  })
  status_code?: number;

  @property({
    type: 'string',
  })
  error_message?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created_at?: string;

  constructor(data?: Partial<AuditLog>) {
    super(data);
  }
}

export interface AuditLogRelations {
  // describe navigational properties here
}

export type AuditLogWithRelations = AuditLog & AuditLogRelations;
