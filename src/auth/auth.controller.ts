import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { Public } from './auth.public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { Request, Response } from 'express';
import { GetUser } from './get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.signIn(signInDto);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true, // en producción true
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token, user };
  }

  @Public()
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res() res: Response,
    @GetUser() user: User,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.authService.refreshTokens(user.id, refreshToken);

    res.cookie('refresh_token', payload.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: payload.access_token,
    };
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token', { path: '/auth/refersh' });

    return { message: 'Logged out' };
  }
}
