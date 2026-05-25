import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {table: 'analysis_templates'},
  },
})
export class AnalysisTemplate extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  template_id?: number;

  @property({
    type: 'string',
    required: true,
    length: 100,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {dataType: 'text'},
  })
  prompt: string;

  @property({
    type: 'string',
    length: 32,
  })
  category?: string;

  @property({
    type: 'number',
  })
  sort_order?: number;

  constructor(data?: Partial<AnalysisTemplate>) {
    super(data);
  }
}

export interface AnalysisTemplateRelations {
  // describe navigational properties here
}

export type AnalysisTemplateWithRelations = AnalysisTemplate & AnalysisTemplateRelations;
