import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IUser } from 'src/user/interfaces/IUser.interface';

export const TGroups = (roles: string[]): any => SetMetadata('TGroups', roles);

@Injectable()
export class GroupsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const roles = this.reflector.get<string[]>('TGroups', context.getHandler());

    if (!roles || !roles.length) {
      return true;
    }

    const req = ctx.getRequest() as Request;

    const user = req.user as IUser;
    return roles.some((r) => {
      if (user.group.toLowerCase().includes(r.toLowerCase())) {
        return true;
      }
      return false;
    });
  }
}
