import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {table: 'chat_sessions'},
    indexes: {
      idx_session_employee: {keys: {employee_id: 1, is_deleted: 1}},
      idx_session_updated: {keys: {updated_at: -1}},
    },
  },
})
export class ChatSession extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  session_id?: number;

  @property({
    type: 'string',
    required: true,
    length: 128,
  })
  employee_id: string;

  @property({
    type: 'string',
    length: 255,
  })
  title?: string;

  @property({
    type: 'string',
    length: 32,
  })
  mode?: string; // 'chat' | 'analysis'

  @property({
    type: 'boolean',
    default: false,
  })
  is_deleted?: boolean;

  @property({
    type: 'object',
    postgresql: {dataType: 'jsonb'},
  })
  context_snapshot?: object;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created_at?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updated_at?: string;

  constructor(data?: Partial<ChatSession>) {
    super(data);
  }
}

export interface ChatSessionRelations {
  // describe navigational properties here
}

export type ChatSessionWithRelations = ChatSession & ChatSessionRelations;
