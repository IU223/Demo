import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {table: 'chat_messages'},
    indexes: {
      idx_message_session: {keys: {session_id: 1, created_at: 1}},
      idx_message_favorite: {keys: {session_id: 1, is_favorite: 1}},
    },
  },
})
export class ChatMessage extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  message_id?: number;

  @property({
    type: 'number',
    required: true,
  })
  session_id: number;

  @property({
    type: 'string',
    required: true,
    length: 16,
  })
  role: string; // 'user' | 'assistant' | 'system'

  @property({
    type: 'string',
    required: true,
    postgresql: {dataType: 'text'},
  })
  content: string;

  @property({
    type: 'object',
    postgresql: {dataType: 'jsonb'},
  })
  metadata?: object;

  @property({
    type: 'boolean',
    default: false,
  })
  is_favorite?: boolean;

  @property({
    type: 'number',
  })
  token_count?: number;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created_at?: string;

  constructor(data?: Partial<ChatMessage>) {
    super(data);
  }
}

export interface ChatMessageRelations {
  // describe navigational properties here
}

export type ChatMessageWithRelations = ChatMessage & ChatMessageRelations;
