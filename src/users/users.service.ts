import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/db/drizzle.service';
import { User, users } from 'src/db/schema/user';
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

  async create(user: User) {
    const result = await this.drizzle.db
      .insert(users)
      .values(user)
      .$returningId();
    if (result[0] && result[0].userId) {
      return {
        ...user,
        userId: result[0].userId,
      };
    }
    return null;
  }

  // update(userId: UUID, userInformation: Partial<User>): Promise<> {
  //   return this.usersRepository.update(userId, userInformation);
  // }

  async findOne(userName: string) {
    const result = await this.drizzle.db
      .select({
        userName: users.userName,
        userId: users.userId,
        password: users.password,
      })
      .from(users)
      .where(eq(users.userName, userName));

    if (result.length === 0) {
      // throw new NotFoundException(`用户名：${userName}不存在`);
      return null;
    }

    return result[0];
  }

  async findAll() {
    // const result = await this.drizzle.db
    //   .select({
    //     userName: users.userName,
    //     userId: users.userId,
    //   })
    //   .from(users);
    const result = await this.drizzle.db.query.users.findMany({
      columns: {
        userId: true,
        userName: true,
      },
      with: {
        roles: {
          with: {
            role: true,
          },
        },
      },
    });
    return result;
  }
}
