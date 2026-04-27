import { Entity, model, property } from '@loopback/repository';

@model()
export class Department extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  dept_id: number;

  @property({
    type: 'string',
  })
  dept_code?: string;

  @property({
    type: 'string',
  })
  dept_desc?: string;
  @property({
    type: 'string',
  })
  dept_desc_a?: string;

  constructor(data?: Partial<Department>) {
    super(data);
  }
}

export interface DepartmentRelations {
  // describe navigational properties here
}

export type DepartmentWithRelations = Department & DepartmentRelations;
