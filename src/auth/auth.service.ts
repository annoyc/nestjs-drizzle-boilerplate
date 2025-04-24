import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/db/schema/user';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LoginResponseDTO } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userName: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByUserName(userName);
    if (!user) {
      throw new BadRequestException('用户未找到');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('用户名或密码不匹配');
    }
    return user;
  }
  login(user: User): LoginResponseDTO {
    const payload = { userName: user.userName };
    return {
      token: this.jwtService.sign(payload),
      userId: user.userId,
      userName: user.userName,
    };
  }
  async register(user: RegisterRequestDto): Promise<LoginResponseDTO> {
    const existingUser = await this.usersService.findOneByUserName(
      user.userName,
    );
    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = { ...user, password: hashedPassword };
    const createRes = await this.usersService.create(newUser);
    // return this.login(newUser);
    const payload = { userName: newUser.userName, id: createRes.userId };
    return { token: this.jwtService.sign(payload) };
  }
}
