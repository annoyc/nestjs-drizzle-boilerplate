// posts/dto/create-post.dto.ts
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException, PipeTransform } from '@nestjs/common';

// Zod schema
export const updatePostSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  content: z.string().min(1, '内容不能为空'),
  authorId: z.number().int().min(1, '作者ID必须为正整数'),
});

// 类型
export type UpdatePostType = z.infer<typeof updatePostSchema>;

// Swagger文档用DTO类
export class UpdatePostDto {
  @ApiProperty({
    description: '帖子ID',
    example: 1,
    type: 'integer',
    minimum: 1,
  })
  id: number;

  @ApiProperty({
    description: '帖子标题',
    example: '更新后的标题',
    minLength: 1,
  })
  title: string;

  @ApiProperty({
    description: '帖子内容',
    example: '这是更新后的内容',
    minLength: 1,
  })
  content: string;

  @ApiProperty({
    description: '作者ID',
    example: 1,
    type: 'integer',
    minimum: 1,
  })
  authorId: number;
}

// 验证管道
export class ZodUpdatePostValidationPipe implements PipeTransform {
  transform(value: unknown) {
    try {
      return updatePostSchema.parse(value);
    } catch (error) {
      throw new BadRequestException(`数据验证失败: ${this.formatError(error)}`);
    }
  }

  private formatError(error) {
    return error.errors
      .map(
        (e) =>
          `${this.getFieldName(e.path[0])}: ${this.translateMessage(e.message)}`,
      )
      .join(', ');
  }

  private getFieldName(field: string): string {
    const map = { title: '标题', content: '内容', authorId: '作者ID' };
    return map[field] || field;
  }

  private translateMessage(msg: string): string {
    if (msg === 'Required') return '必填项';
    return msg;
  }
}
