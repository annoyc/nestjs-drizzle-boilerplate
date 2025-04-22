import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

// Zod schema
export const registerRequestDto = z.object({
  userName: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
});

// Swagger文档用DTO类
export class RegisterRequestDto {
  @ApiProperty({
    description: '用户名',
    example: '示例用户名',
    minLength: 1,
  })
  userName: string;

  @ApiHideProperty()
  password: string;
}

// 类型
export type RegisterRequestType = z.infer<typeof registerRequestDto>;

// 验证管道
export class ZodRegisterRequestValidationPipe implements PipeTransform {
  transform(value: unknown) {
    try {
      return registerRequestDto.parse(value);
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
    const map = { userName: '用户名', password: '密码' };
    return map[field] || field;
  }

  private translateMessage(msg: string): string {
    if (msg === 'Required') return '必填项';
    return msg;
  }
}
