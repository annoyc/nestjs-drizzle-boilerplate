import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { DrizzleService } from 'src/db/drizzle.service';
import { User, users } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}

  findOneByUserName(userName: string): Promise<User | null> {
    return this.findOne(userName);
  }

  // findOneById(id: UUID): Promise<User | null> {
  //   return this.usersRepository.findOneBy({ id });
  // }

  create(user: User): Promise<User> {
    const result = this.drizzle.db.insert(users).values(user);
    return result;
  }

  // update(userId: UUID, userInformation: Partial<User>): Promise<> {
  //   return this.usersRepository.update(userId, userInformation);
  // }

  async findOne(userName: string) {
    const result = await this.drizzle.db
      .select({
        user: users,
      })
      .from(users)
      .where(eq(users.userName, userName));

    if (result.length === 0) {
      // throw new NotFoundException(`用户名：${userName}不存在`);
      return null;
    }

    return result[0];
  }
}
