import { Entity, model, property } from '@loopback/repository';

@model()
export class Plant extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  plant_id?: number;
  @property({
    type: 'string',
  })
  site?: string;

  @property({
    type: 'string',
  })
  plant_name?: string;



  constructor(data?: Partial<Plant>) {
    super(data);
  }
}

export interface PlantRelations {
  // describe navigational properties here
}

export type PlantWithRelations = Plant & PlantRelations;
