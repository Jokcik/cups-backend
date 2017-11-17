import {Guard, Param} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {CanActivate} from '@nestjs/common/interfaces/can-activate.interface';
import {ExecutionContext} from '@nestjs/common/interfaces/execution-context.interface';
import {RolesTypes} from '../core/constants';
import {AUser} from '../authenticate/a-user';
import * as _ from 'lodash';

@Guard()
export class GameRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  async canActivate(req, context: ExecutionContext): Promise<boolean> {
    let user: AUser = req.user;
    if (!user) return true;

    if (user.admin) {
      user.roles = RolesTypes.ADMIN;
    }

    const { handler } = context;
    let roles = this.reflector.get<number[]>('roles', handler);
    if (!roles) {
      roles = [];
    }

    if (_.includes(roles, RolesTypes.ADMIN) && user.isAdmin())
      return true;

    return roles.length == 0 || _.includes(roles, RolesTypes.ALL);
  }
}