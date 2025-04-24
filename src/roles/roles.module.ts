import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { DrizzleModule } from 'src/db/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
