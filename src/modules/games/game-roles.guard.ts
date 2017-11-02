import {Guard, Param} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {CanActivate} from '@nestjs/common/interfaces/can-activate.interface';
import {ExecutionContext} from '@nestjs/common/interfaces/execution-context.interface';
import {RolesTypes} from '../constants';

@Guard()
export class GameRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  async canActivate(req, context: ExecutionContext): Promise<boolean> {
    const { parent, handler } = context;

    const roles = this.reflector.get<number[]>('roles', handler);
    if (!roles || roles.length == 0 || roles.indexOf(RolesTypes.ALL)) return true;

    if (roles.indexOf(RolesTypes.ADMIN) && true)
        return true;

    return false;
  }
}