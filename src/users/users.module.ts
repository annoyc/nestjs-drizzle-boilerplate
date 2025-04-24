import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleModule } from 'src/db/drizzle.module';

@Global()
@Module({
  imports: [DrizzleModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
