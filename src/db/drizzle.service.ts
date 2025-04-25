import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
import { Logger } from 'drizzle-orm/logger';
import * as schema from './schema';
// import { seed } from 'drizzle-seed';
dotenv.config();

@Injectable()
export class DrizzleService implements OnModuleInit {
  public db;

  async onModuleInit() {
    try {
      // 使用 mysql2 的正确方式创建连接池
      const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        // 添加额外配置以提高稳定性
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // 测试连接
      await pool.getConnection();
      console.log('数据库连接成功！');

      // 创建一个自定义的日志记录器
      // const customLogger = {
      //   logQuery: (query: string, params: unknown[]) => {
      //     Logger('Query:', query);
      //     console.log('Params:', params);
      //   }
      // };

      class MyLogger implements Logger {
        logQuery(query: string, params: unknown[]): void {
          console.log({ query, params });
        }
      }

      // 使用 drizzle 创建数据库实例，并传递日志记录器
      this.db = drizzle(pool, {
        schema,
        mode: 'default',
        logger: new MyLogger(),
      });
      // await seed(this.db, schema).refine((f) => ({
      //   users: {
      //     count: 5,
      //     columns: {
      //       id: f.int({
      //         minValue: 10000,
      //         maxValue: 20000,
      //         isUnique: true,
      //       }),
      //     },
      //   },
      //   posts: {
      //     count: 20,
      //     columns: {
      //       description: f.valuesFromArray({
      //         values: [
      //           'The sun set behind the mountains, painting the sky in hues of orange and purple',
      //           "I can't believe how good this homemade pizza turned out!",
      //           'Sometimes, all you need is a good book and a quiet corner.',
      //           'Who else thinks rainy days are perfect for binge-watching old movies?',
      //           'Tried a new hiking trail today and found the most amazing waterfall!',
      //           // ...
      //         ],
      //       }),
      //     },
      //   },
      // }));
    } catch (error) {
      console.error('数据库连接错误:', error);
      throw error;
    }
  }
}
