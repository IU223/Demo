import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Region, RegionRelations} from '../models';

export class RegionRepository extends DefaultCrudRepository<
  Region,
  typeof Region.prototype.region_id,
  RegionRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Region, dataSource);
  }
}
