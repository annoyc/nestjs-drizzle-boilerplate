import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from 'src/db/drizzle.service';
import { CreateRoleType } from './dto/create-role.dto';
import { roles } from 'src/db/schema/role';
import { eq, sql } from 'drizzle-orm';
import { ZodError } from 'zod';
import { users } from 'src/db/schema/user';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from 'src/db/schema';
@Injectable()
export class RolesService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async create(postData: CreateRoleType) {
    try {
      // 插入数据
      const result = await this.drizzleService.db
        .insert(roles)
        .values(postData)
        .$returningId();

      // 返回创建的角色
      if (result[0] && result[0].roleId) {
        return { message: '创建角色成功', id: result[0].roleId };
      }
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new BadRequestException(`数据验证失败: ${formattedErrors}`);
      }

      console.error('创建角色时出错:', error);
      throw new BadRequestException('创建角色失败');
    }
  }
  async findOne(id: number) {
    const result = await this.drizzleService.db
      .select(roles)
      .from(roles)
      .where(eq(roles.roleId, id));

    if (result.length === 0) {
      throw new NotFoundException(`ID为${id}的角色不存在`);
    }

    return result[0];
  }

  async findAll() {
    const res = await this.drizzleService.db.query.roles.findMany({
      with: {
        roleId: true,
        name: true,
      },
    });
    // const result = await this.drizzleService.db
    //   .select({
    //     ruleId: roles.roleId,
    //     ruleName: roles.name,
    //   })
    //   .from(roles)
    //   .leftJoin(users, eq(roles.roleId, users.roleId))
    //   // 按角色字段分组（MySQL 需要明确分组字段）
    //   .groupBy(roles.roleId, roles.name);
    // return result;
    return res;
  }
}
