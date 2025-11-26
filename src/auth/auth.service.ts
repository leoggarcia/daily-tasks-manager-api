import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    if (user instanceof HttpException) {
      throw new HttpException("Wrong email or password", HttpStatus.UNAUTHORIZED);
    }

    const passwordIsValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const { password, ...restOfUser } = user;

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: restOfUser,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if (user instanceof HttpException) {
      throw new UnauthorizedException();
    }

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException();
    }

    const tokenMatch = await bcrypt.compare(refreshToken, user.refresh_token);

    if (!tokenMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    this.usersService.updateRefreshToken(userId, newRefreshToken);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
