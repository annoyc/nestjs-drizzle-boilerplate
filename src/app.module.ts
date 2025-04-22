import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [DbModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
