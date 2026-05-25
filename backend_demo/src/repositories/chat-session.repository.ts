import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {ChatSession, ChatSessionRelations} from '../models';

export class ChatSessionRepository extends DefaultCrudRepository<
  ChatSession,
  typeof ChatSession.prototype.session_id,
  ChatSessionRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(ChatSession, dataSource);
  }
}
