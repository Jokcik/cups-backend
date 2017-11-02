import {Guard, Param} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {CanActivate} from '@nestjs/common/interfaces/can-activate.interface';
import {ExecutionContext} from '@nestjs/common/interfaces/execution-context.interface';
import {RolesTypes} from '../constants';
import * as _ from 'lodash';
import {TeamsService} from './teams.service';

@Guard()
export class TeamsRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              private readonly teamsService: TeamsService) {
  }

  async canActivate(req, context: ExecutionContext): Promise<boolean> {
    const { parent, handler } = context;

    const roles = this.reflector.get<number[]>('roles', handler);
    if (!roles || roles.length == 0 || roles.indexOf(RolesTypes.ALL)) return true;

    let user = req.user;
    if (req.params && req.params.id) {
      let cup = await this.teamsService.findById(req.params.id);

      if (_.includes(roles, RolesTypes.CREATOR) && this.teamsService.isCreator(cup, user.id))
        return true;

      if (roles.indexOf(RolesTypes.ADMIN) && true)
        return true;
    }

    return false;
  }
}