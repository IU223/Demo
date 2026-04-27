import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Plant, PlantRelations} from '../models';

export class PlantRepository extends DefaultCrudRepository<
  Plant,
  typeof Plant.prototype.plant_id,
  PlantRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Plant, dataSource);
  }
}
