import {Guard, Param} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {CanActivate} from '@nestjs/common/interfaces/can-activate.interface';
import {ExecutionContext} from '@nestjs/common/interfaces/execution-context.interface';
import {CupsService} from './cups.service';
import {RolesTypes} from '../core/constants';
import * as _ from 'lodash';
import {AUser} from '../authenticate/a-user';
import {LongCup, ShortCup} from './interfaces/cup.interface';

@Guard()
export class CupRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              private readonly cupsService: CupsService) {
  }

  private setRoles(user: AUser, cup: LongCup = null) {
    user.roles = RolesTypes.ALL;

    if (cup && this.cupsService.isJudges(cup, user.id)) {
      user.roles = RolesTypes.CREATOR;
    }

    if (cup && this.cupsService.isCreator(cup, user.id)) {
      user.roles = RolesTypes.CREATOR;
    }

    if (user.admin) {
      user.roles = RolesTypes.ADMIN;
    }
  }

  async canActivate(req, context: ExecutionContext): Promise<boolean> {
    let user: AUser = req.user;
    if (!user) return true;

    this.setRoles(user);

    const { handler } = context;

    let roles = this.reflector.get<number[]>('roles', handler);
    if (!roles) {
      roles = [];
    }

    let cupUrl = req.params.cupUrl;
    if (req.params && cupUrl) {
      let cup = await this.cupsService.findByUrl(cupUrl);
      this.setRoles(user, cup);

      if (_.includes(roles, RolesTypes.JUDGES) && user.isJudge())
        return true;

      if (_.includes(roles, RolesTypes.CREATOR) && user.isCreator())
        return true;
    }

    if (_.includes(roles, RolesTypes.ADMIN) && user.isAdmin())
      return true;

    return roles.length == 0 || _.includes(roles, RolesTypes.ALL);
  }
}