// posts/dto/create-post.dto.ts
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException, PipeTransform } from '@nestjs/common';

// Zod schema
export const createRoleSchema = z.object({
  name: z.string().min(1, '角色名不能为空'),
});

// 类型
export type CreateRoleType = z.infer<typeof createRoleSchema>;

// Swagger文档用DTO类
export class CreateRoleDto {
  @ApiProperty({
    description: '角色名',
    example: '示例角色名',
    minLength: 1,
  })
  name: string;
}

// 验证管道
export class ZodRoleValidationPipe implements PipeTransform {
  transform(value: unknown) {
    try {
      return createRoleSchema.parse(value);
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
    const map = { name: '角色名' };
    return map[field] || field;
  }

  private translateMessage(msg: string): string {
    if (msg === 'Required') return '必填项';
    return msg;
  }
}
