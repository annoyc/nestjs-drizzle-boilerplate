import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DrizzleModule } from '../db/drizzle.module';
@Module({
  imports: [DrizzleModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
