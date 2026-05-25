import {Entity, model, property} from '@loopback/repository';

/**
 * AI 用量日志模型
 *
 * Phase 1 仅建表 + Repository，不建 Controller。
 * Phase 4 启用时再创建对应的 Controller 和 API 端点。
 */
@model({
  settings: {
    postgresql: {table: 'ai_usage_logs'},
    indexes: {
      idx_usage_employee_date: {keys: {employee_id: 1, created_at: 1}},
    },
  },
})
export class AiUsageLog extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  usage_id?: number;

  @property({
    type: 'string',
    required: true,
    length: 128,
  })
  employee_id: string;

  @property({
    type: 'number',
  })
  session_id?: number;

  @property({
    type: 'number',
  })
  input_tokens?: number;

  @property({
    type: 'number',
  })
  output_tokens?: number;

  @property({
    type: 'string',
    length: 64,
  })
  model?: string;

  @property({
    type: 'number',
    postgresql: {
      dataType: 'NUMERIC',
      dataPrecision: 10,
      dataScale: 4,
    },
  })
  cost_cny?: number;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created_at?: string;

  constructor(data?: Partial<AiUsageLog>) {
    super(data);
  }
}

export interface AiUsageLogRelations {
  // describe navigational properties here
}

export type AiUsageLogWithRelations = AiUsageLog & AiUsageLogRelations;
