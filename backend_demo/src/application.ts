
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { AuthInterceptor } from './interceptors/auth.interceptor';
// AI 服务
import { MockProvider } from './services/mock.provider';
import { DeepSeekProvider } from './services/deepseek.provider';
import { AiService } from './services/ai.service';
import { AiContextBuilder } from './services/ai-context-builder.service';

export { ApplicationConfig };

export class BackendDemoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // 注册 AI 服务
    this.setupAiServices();
  }

  /**
   * 注册 AI Provider、AiService、AiContextBuilder
   *
   * 绑定关系：
   *   services.AiProvider      → MockProvider | DeepSeekProvider
   *   services.AiService       → AiService（注入 AiProvider）
   *   services.AiContextBuilder → AiContextBuilder
   */
  private setupAiServices(): void {
    // const isMock = process.env.AI_MOCK === 'true';
    const isMock = false; // 开发阶段强制使用 MockProvider，避免误调用真实 API 产生费用
    const aiProvider = isMock
      ? new MockProvider()
      : new DeepSeekProvider(
        process.env.AI_API_KEY || '',
        process.env.AI_BASE_URL || undefined,
        process.env.AI_MODEL || undefined,
      );

    this.bind('services.AiProvider').to(aiProvider);
    this.bind('services.AiService').toClass(AiService);
    this.bind('services.AiContextBuilder').to(new AiContextBuilder());

    const providerName = isMock ? 'MockProvider' : 'DeepSeekProvider';
    console.log(
      `[AI] Provider=${providerName} | Mock=${isMock} | Model=${process.env.AI_MODEL || 'default'}`,
    );
    if (!isMock && !process.env.AI_API_KEY) {
      console.warn(
        '[AI] ⚠️ 警告：AI_MOCK 未启用但 AI_API_KEY 未设置，AI 功能将无法正常工作',
      );
    }
  }
}
