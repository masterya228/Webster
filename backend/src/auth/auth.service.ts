import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto.email, dto.name, dto.password);

    this.emailService
      .sendVerificationEmail(user.email, user.name, user.verificationToken)
      .catch((err) => console.error('[Auth] Email send error:', err?.message));

    return {
      message: 'Реєстрація успішна. Перевірте пошту та підтвердіть акаунт.',
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Невірний email або пароль');
    if (!user.password)
      throw new UnauthorizedException('Цей акаунт використовує вхід через Google');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Невірний email або пароль');

    if (!user.isVerified) {
      throw new UnauthorizedException({
        message: 'Акаунт не підтверджено. Перевірте пошту.',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
      });
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role } };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new BadRequestException('Посилання недійсне або вже використане');

    await this.usersService.verifyUser(user);
    await this.emailService.sendPasswordChangedEmail(user.email, user.name).catch(() => {});

    const jwtToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      token: jwtToken,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role },
    };
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Користувача не знайдено');
    if (user.isVerified) throw new BadRequestException('Акаунт вже підтверджено');

    const updated = await this.usersService.refreshVerificationToken(user);
    await this.emailService.sendVerificationEmail(
      updated.email,
      updated.name,
      updated.verificationToken,
    );
    return { message: 'Лист відправлено повторно' };
  }

  async forgotPassword(email: string) {
    const result = await this.usersService.createPasswordResetToken(email);
    if (result) {
      await this.emailService
        .sendPasswordResetEmail(result.user.email, result.user.name, result.token)
        .catch(err => console.error('[Auth] Reset email error:', err?.message));
    }
    return { message: 'Якщо акаунт існує — лист із посиланням надіслано на вашу пошту.' };
  }

  async resetPassword(token: string, password: string) {
    if (!password || password.length < 6) {
      throw new BadRequestException('Пароль має бути не менше 6 символів');
    }
    await this.usersService.resetPasswordByToken(token, password);
    return { message: 'Пароль успішно змінено. Тепер ви можете увійти.' };
  }

  signTokenForUser(user: User) {
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role },
    };
  }
}
