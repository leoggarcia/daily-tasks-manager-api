import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './auth.public.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFomHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const fullUser = await this.getFullUser(payload.sub);

      request['user'] = fullUser;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFomHeader(request: Request) {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader?.split(' ') ?? [];

      if(token && type === 'Bearer'){
        return token
      }
    }

    const refreshToken = request.cookies["refresh_token"];
    if(refreshToken){
      return refreshToken
    }

    return undefined;
  }
  
  private async getFullUser(id: number){
    const user = await this.usersService.findOne(id)

    return user
  }
}
