import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiAuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private auth: ApiAuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const res = await this.auth.login(body.email, body.password);
    this.logger.log(`Login attempt: ${body.email}`);
    return res;
  }
}
