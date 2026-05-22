import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {AuditLog, AuditLogRelations} from '../models';

export class AuditLogRepository extends DefaultCrudRepository<
  AuditLog,
  typeof AuditLog.prototype.log_id,
  AuditLogRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(AuditLog, dataSource);
  }
}
