import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import JWTDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators';
import { IAuthUser } from '../interfaces/auth-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token =
      request?.headers?.authorization || request?.headers?.Authorization || '';
    if (!token) {
      throw new UnauthorizedException();
    }
    const jwtDecode = JWTDecode<IAuthUser>(token);
    request.user = jwtDecode;
    request.token = token;
    return true;
  }
}
