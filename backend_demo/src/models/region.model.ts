import { Entity, model, property } from '@loopback/repository';

@model()
export class Region extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  region_id?: number;

  @property({
    type: 'string',
  })
  region_name?: string;

  @property({
    type: 'number',
  })
  longitude?: number;

  @property({
    type: 'number',
  })
  latitude?: number;


  constructor(data?: Partial<Region>) {
    super(data);
  }
}

export interface RegionRelations {
  // describe navigational properties here
}

export type RegionWithRelations = Region & RegionRelations;
