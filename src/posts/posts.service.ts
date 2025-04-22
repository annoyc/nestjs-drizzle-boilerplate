import { insertPostSchema, posts, users } from '../db/schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DrizzleService } from '../db/drizzle.service';
import { and, eq, sql, getTableColumns } from 'drizzle-orm';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { QueryBuilder } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { ZodError } from 'zod';
@Injectable()
export class PostsService {
  constructor(private readonly drizzle: DrizzleService) {}
  async create(postData: unknown) {
    try {
      // 插入数据
      const result = await this.drizzle.db.insert(posts).values(postData);

      // 返回创建的帖子
      if (result.insertId) {
        return this.findOne(Number(result.insertId));
      }

      return { message: '创建帖子成功', id: result.insertId };
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new BadRequestException(`数据验证失败: ${formattedErrors}`);
      }

      console.error('创建帖子时出错:', error);
      throw new BadRequestException('创建帖子失败');
    }
  }

  async findAll() {
    // 获取所有帖子，包括作者信息
    const result = await this.drizzle.db
      .select({
        post: posts,
        author: {
          id: users.userId,
          name: users.userName,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.userId));

    return result;
  }

  async findOne(id: number) {
    const result = await this.drizzle.db
      .select({
        post: posts,
        author: {
          id: users.userId,
          name: users.userName,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.userId))
      .where(eq(posts.id, id));

    if (result.length === 0) {
      throw new NotFoundException(`ID为${id}的帖子不存在`);
    }

    return result[0];
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      // 先检查帖子是否存在
      await this.findOne(id);

      // 更新帖子
      const result = await this.drizzle.db
        .update(posts)
        .set({
          title: updatePostDto.title,
          content: updatePostDto.content,
          authorId: updatePostDto.authorId,
        })
        .where(eq(posts.id, id));

      if (result.rowsAffected === 0) {
        throw new BadRequestException('更新帖子失败');
      }

      // 返回更新后的帖子
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new BadRequestException(`数据验证失败: ${formattedErrors}`);
      }

      console.error('更新帖子时出错:', error);
      throw new BadRequestException('更新帖子失败');
    }
  }

  async remove(id: number) {
    try {
      // 先检查帖子是否存在
      await this.findOne(id);

      // 删除帖子
      const result = await this.drizzle.db
        .delete(posts)
        .where(eq(posts.id, id));

      if (result.rowsAffected === 0) {
        throw new BadRequestException('删除帖子失败');
      }

      return { message: '删除帖子成功', id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('删除帖子时出错:', error);
      throw new BadRequestException('删除帖子失败');
    }
  }
}
