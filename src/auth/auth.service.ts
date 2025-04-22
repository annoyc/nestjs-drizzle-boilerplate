import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessToken } from './types/AccessToken';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/db/schema';
import { RegisterRequestDto } from './dtos/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userName: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByUserName(userName);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }
  async login(user: User): Promise<AccessToken> {
    const payload = { userName: user.userName, id: user.userId };
    return { access_token: this.jwtService.sign(payload) };
  }
  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByUserName(
      user.userName,
    );
    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = { ...user, password: hashedPassword };
    await this.usersService.create(newUser);
    console.log('newUser', newUser);
    return this.login(newUser);
  }
}
