import { Controller, Post, Body, Get, Query, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register — надсилає лист підтвердження' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login — вимагає підтвердженого акаунту' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Підтвердження email за токеном' })
  async verifyEmail(@Query('token') token: string, @Res() res: any) {
    try {
      const result = await this.authService.verifyEmail(token);
      const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
      return res.redirect(
        `${frontendUrl}/verify-email?success=1&token=${result.token}`,
      );
    } catch (err) {
      const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
      return res.redirect(`${frontendUrl}/verify-email?error=invalid_token`);
    }
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Повторно надіслати лист підтвердження' })
  resendVerification(@Body('email') email: string) {
    return this.authService.resendVerification(email);
  }

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req: any, @Res() res: any) {
    const { token } = this.authService.signTokenForUser(req.user);
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    res.redirect(`${frontendUrl}/oauth/callback?token=${token}`);
  }
}
