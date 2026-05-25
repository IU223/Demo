import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {ChatMessage, ChatMessageRelations} from '../models';

export class ChatMessageRepository extends DefaultCrudRepository<
  ChatMessage,
  typeof ChatMessage.prototype.message_id,
  ChatMessageRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(ChatMessage, dataSource);
  }
}
