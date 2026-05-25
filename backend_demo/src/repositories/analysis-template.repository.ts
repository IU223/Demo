import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {AnalysisTemplate, AnalysisTemplateRelations} from '../models';

export class AnalysisTemplateRepository extends DefaultCrudRepository<
  AnalysisTemplate,
  typeof AnalysisTemplate.prototype.template_id,
  AnalysisTemplateRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(AnalysisTemplate, dataSource);
  }
}
