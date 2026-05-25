import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {AiUsageLog, AiUsageLogRelations} from '../models';

/**
 * Phase 1 仅建 Repository，不建 Controller。
 * Phase 4 启用时再创建 GET /ai/usage/my、GET /ai/usage/admin 等端点。
 */
export class AiUsageLogRepository extends DefaultCrudRepository<
  AiUsageLog,
  typeof AiUsageLog.prototype.usage_id,
  AiUsageLogRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(AiUsageLog, dataSource);
  }
}
