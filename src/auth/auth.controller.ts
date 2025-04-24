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
import { LoginResponseDTO } from './dtos/login-response.dto';
import { RegisterResponseDTO } from './dtos/register-response.dto';
import { Public } from './decorators/public.decorator';

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
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}
