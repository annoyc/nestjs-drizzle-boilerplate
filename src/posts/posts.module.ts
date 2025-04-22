import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DbModule } from '../db/db.module';
@Module({
  imports: [DbModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
