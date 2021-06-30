import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { IUserLogin } from 'src/user/interfaces/IUserLogin.interface';
import { User } from 'src/user/schemas/User.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public redirect(jwt: string, res: Response): void {
    res.send(
      `<script>window.opener.postMessage('tlt=${jwt}', '*');window.close();self.close();</script>`,
    );
  }

  async validateOAuthLogin(u: IUserLogin): Promise<string> {
    try {
      let user = await this.userModel.findOne({
        provider: u.provider,
        thirdPartyId: u.thirdPartyId,
      });
      const date = new Date().getTime();

      if (!user) {
        user = await this.userModel.create({
          ...u,
          firstLogin: date,
          lastLogin: date,
          group: 'User',
        });
      } else {
        await user.updateOne({ $set: { lastLogin: date, avatar: u.avatar } });
      }

      user.lastLogin = date;

      return this.jwtService.sign(user.toObject());
    } catch (error) {
      throw new InternalServerErrorException(
        'validateOAuthLogin',
        error.message,
      );
    }
  }
}
