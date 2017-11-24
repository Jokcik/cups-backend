import {Guard} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {CanActivate} from '@nestjs/common/interfaces/can-activate.interface';
import {ExecutionContext} from '@nestjs/common/interfaces/execution-context.interface';
import {RolesTypes} from '../core/constants';
import * as _ from 'lodash';
import {TeamsService} from './teams.service';
import {AUser} from '../authenticate/a-user';
import {LongTeam} from './interfaces/team.interface';

@Guard()
export class TeamsRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              private readonly teamsService: TeamsService) {
  }

  private setRoles(user: AUser, team: LongTeam = null) {
    user.roles = RolesTypes.ALL;

    if (team && this.teamsService.isCreator(team, user.id)) {
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

    let teamId = req.params.id;
    if (req.params && teamId) {
      let team = await this.teamsService.findById(teamId);
      this.setRoles(user, team);

      if (_.includes(roles, RolesTypes.CREATOR) && user.isCreator())
        return true;
    }

    if (_.includes(roles, RolesTypes.ADMIN) && user.isAdmin())
      return true;

    return roles.length == 0 || _.includes(roles, RolesTypes.ALL);
  }
}