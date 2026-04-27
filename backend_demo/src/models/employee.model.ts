import { Entity, model, property } from '@loopback/repository';

@model()
export class Employee extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  employee_id: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  name_a?: string;

  @property({
    type: 'number',
  })
  dept_id?: number;

  @property({
    type: 'number',
  })
  plant_id?: number;

  @property({
    type: 'number',
  })
  role_id?: number;

  @property({
    type: 'date',
  })
  hire_date?: string;

  @property({
    type: 'date',
  })
  resin_date?: string;

  @property({
    type: 'number',
  })
  status?: number;

  @property({
    type: 'boolean',
  })
  hasaccess?: boolean;


  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // describe navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;
