import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID') || 'DISABLED';
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET') || 'DISABLED';
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback';

    super({ clientID, clientSecret, callbackURL, scope: ['email', 'profile'] });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails, photos } = profile;
    const user = await this.usersService.findOrCreateGoogle({
      googleId: id,
      email: emails[0].value,
      name: displayName,
      avatar: photos?.[0]?.value,
    });
    done(null, user);
  }
}
