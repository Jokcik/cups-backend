import {Guard, Param} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {CanActivate} from '@nestjs/common/interfaces/can-activate.interface';
import {ExecutionContext} from '@nestjs/common/interfaces/execution-context.interface';
import {CupsService} from './cups.service';
import {RolesTypes} from '../constants';
import * as _ from 'lodash';

@Guard()
export class CupRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              private readonly cupsService: CupsService) {
  }

  async canActivate(req, context: ExecutionContext): Promise<boolean> {
    const { parent, handler } = context;

    const roles = this.reflector.get<number[]>('roles', handler);
    if (!roles || roles.length == 0 || roles.indexOf(RolesTypes.ALL)) return true;

    let user = req.user;
    if (req.params && req.params.id) {
      let cup = await this.cupsService.findById(req.params.id);

      if (_.includes(roles, RolesTypes.CREATOR) && this.cupsService.isCreator(cup, user.id))
        return true;

      if (_.includes(roles, RolesTypes.JUDGES) && this.cupsService.isJudges(cup, user.id))
        return true;

      // if (roles.indexOf(RolesTypes.ADMIN))
      //   return true;
    }

    return false;
  }
}