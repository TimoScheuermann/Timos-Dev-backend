import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {
    // initiates the google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line
  googleLoginCallback(@Req() req: any, @Res() res: Response): void {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }
}
