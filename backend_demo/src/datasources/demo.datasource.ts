import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
// const config = {
//   name: 'demo',
//   connector: 'sqlite3',
//   // 指定 SQLite 数据库文件的存放路径。
//   // 如果你想使用纯内存数据库，可以将其设为 file: ':memory:'
//   file: './data/demo.sqlite'
// };
const config = {
  name: 'Demo',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'Demo'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DemoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Demo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Demo', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
