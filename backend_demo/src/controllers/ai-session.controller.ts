import {inject} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {
  get,
  param,
  patch,
  del,
  requestBody,
  response,
  RestBindings,
  Request,
} from '@loopback/rest';
import {ChatSession, ChatMessage} from '../models';
import {ChatSessionRepository, ChatMessageRepository} from '../repositories';
import {CurrentUserProfile} from '../interceptors/auth.interceptor';

export class AiSessionController {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @repository(ChatSessionRepository)
    private chatSessionRepository: ChatSessionRepository,
    @repository(ChatMessageRepository)
    private chatMessageRepository: ChatMessageRepository,
  ) {}

  private getCurrentUser(): CurrentUserProfile {
    const user = (this.request as any).currentUser as CurrentUserProfile | undefined;
    if (!user) {
      throw Object.assign(new Error('未登录'), {statusCode: 401});
    }
    return user;
  }

  private applyUserFilter(where?: Where<ChatSession>): Where<ChatSession> {
    const user = this.getCurrentUser();
    if (user.is_super_admin) return where ?? {};
    const userWhere = {employee_id: user.employee_id};
    if (where && Object.keys(where).length > 0) {
      return {and: [userWhere, where]} as Where<ChatSession>;
    }
    return userWhere as Where<ChatSession>;
  }

  @get('/ai/sessions')
  @response(200, {description: 'List chat sessions'})
  async find(
    @param.query.number('skip') skip?: number,
    @param.query.number('limit') limit?: number,
  ): Promise<ChatSession[]> {
    const where = this.applyUserFilter({is_deleted: false});
    return this.chatSessionRepository.find({
      where,
      order: ['updated_at DESC'],
      skip: skip || 0,
      limit: limit || 50,
    });
  }

  @get('/ai/sessions/count')
  @response(200, {description: 'Session count'})
  async count(): Promise<{count: number}> {
    const where = this.applyUserFilter({is_deleted: false});
    return this.chatSessionRepository.count(where);
  }

  @get('/ai/sessions/{id}')
  @response(200, {description: 'Session detail with messages'})
  async findById(
    @param.path.number('id') id: number,
  ): Promise<{session: ChatSession; messages: ChatMessage[]}> {
    const session = await this.chatSessionRepository.findById(id);
    const user = this.getCurrentUser();
    if (!user.is_super_admin && session.employee_id !== user.employee_id) {
      throw Object.assign(new Error('无权访问此会话'), {statusCode: 403});
    }
    const messages = await this.chatMessageRepository.find({
      where: {session_id: id},
      order: ['created_at ASC'],
    });
    return {session, messages};
  }

  @patch('/ai/sessions/{id}')
  @response(204, {description: 'Session PATCH success'})
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {title: {type: 'string'}},
          },
        },
      },
    })
    body: {title?: string},
  ): Promise<void> {
    const session = await this.chatSessionRepository.findById(id);
    const user = this.getCurrentUser();
    if (!user.is_super_admin && session.employee_id !== user.employee_id) {
      throw Object.assign(new Error('无权修改此会话'), {statusCode: 403});
    }
    await this.chatSessionRepository.updateById(id, {
      title: body.title,
      updated_at: new Date().toISOString(),
    });
  }

  @del('/ai/sessions/{id}')
  @response(204, {description: 'Session soft-delete success'})
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const session = await this.chatSessionRepository.findById(id);
    const user = this.getCurrentUser();
    if (!user.is_super_admin && session.employee_id !== user.employee_id) {
      throw Object.assign(new Error('无权删除此会话'), {statusCode: 403});
    }
    await this.chatSessionRepository.updateById(id, {
      is_deleted: true,
      updated_at: new Date().toISOString(),
    });
  }
}
