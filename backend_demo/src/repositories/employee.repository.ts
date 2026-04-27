import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Employee, EmployeeRelations} from '../models';

export class EmployeeRepository extends DefaultCrudRepository<
  Employee,
  typeof Employee.prototype.employee_id,
  EmployeeRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Employee, dataSource);
  }
}
