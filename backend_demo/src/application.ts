
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
import { ZhipuProvider } from './services/zhipu.provider';
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
    const isMock = process.env.AI_MOCK === 'true';
    const aiProviderType = process.env.AI_PROVIDER || 'deepseek';

    let aiProvider;
    let providerName: string;

    if (isMock) {
      aiProvider = new MockProvider();
      providerName = 'MockProvider';
    } else if (aiProviderType === 'zhipu') {
      aiProvider = new ZhipuProvider(
        process.env.AI_API_KEY || '',
        process.env.AI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
        process.env.AI_MODEL || 'glm-4.7-flash',
      );
      providerName = 'ZhipuProvider';
    } else {
      aiProvider = new DeepSeekProvider(
        process.env.AI_API_KEY || '',
        process.env.AI_BASE_URL || undefined,
        process.env.AI_MODEL || undefined,
      );
      providerName = 'DeepSeekProvider';
    }

    this.bind('services.AiProvider').to(aiProvider);
    this.bind('services.AiService').toClass(AiService);
    this.bind('services.AiContextBuilder').to(new AiContextBuilder());

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
