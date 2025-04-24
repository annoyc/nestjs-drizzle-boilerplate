import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    minLength: 1,
  })
  userName: string;
  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  password?: string;
  userId?: number;
}

export class LoginResponseDTO {
  @ApiProperty({
    description: 'JWT token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQss',
    minLength: 1,
  })
  token: string;
  @ApiProperty({
    description: '用户 ID',
    example: 1,
    minimum: 1,
  })
  userId?: number;
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    minLength: 1,
  })
  userName?: string;
}
