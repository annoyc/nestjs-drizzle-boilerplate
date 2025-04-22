// main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { JwtGuard } from './auth/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 必须在创建 Swagger 文档之前调用这个方法
  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('API 文档')
    .setDescription('使用 Zod 验证的 API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors(); // 启用CORS
  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));
  await app.listen(3000);
  console.log(`应用程序运行在: http://localhost:3000`);
}
bootstrap();
