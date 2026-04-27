import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Department, DepartmentRelations} from '../models';

export class DepartmentRepository extends DefaultCrudRepository<
  Department,
  typeof Department.prototype.dept_id,
  DepartmentRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Department, dataSource);
  }
}
