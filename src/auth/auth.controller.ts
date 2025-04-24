import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';
import {
  RegisterRequestDto,
  ZodRegisterRequestValidationPipe,
} from './dtos/register-request.dto';
import { LoginResponseDTO } from './dtos/login.dto';
import { Public } from './decorators/public.decorator';
import { RegisterResponseType } from './types/RegisterResponse';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req): LoginResponseDTO | BadRequestException {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body(new ZodRegisterRequestValidationPipe())
    registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseType | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}
