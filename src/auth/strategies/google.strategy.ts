import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';
import { IUserLogin } from 'src/user/interfaces/IUserLogin.interface';
import { Provider } from '../Provider.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    configServive: ConfigService,
  ) {
    super({
      clientID: configServive.get('GOOGLE_CLIENT_ID'),
      clientSecret: configServive.get('GOOGLE_SECRET'),
      callbackURL: `${configServive.get('CALLBACK')}google/callback`,
      passReqToCallback: true,
      scope: ['profile'],
    });
  }

  async validate(
    _request: string,
    _accessToken: string,
    _refreshToken: string,
    // eslint-disable-next-line
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, photos } = profile;
      const username = [name.familyName, name.givenName]
        .filter((x) => !!x)
        .join(' ');

      const user: IUserLogin = {
        avatar: photos[0].value,
        username: username,
        thirdPartyId: `${profile.id}`,
        provider: Provider.GOOGLE,
      };

      const jwt = await this.authService.validateOAuthLogin(user);
      done(null, { jwt });
    } catch (error) {
      done(error, false);
    }
  }
}
