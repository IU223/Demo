import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Role, RoleRelations} from '../models';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.role_id,
  RoleRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Role, dataSource);
  }
}
