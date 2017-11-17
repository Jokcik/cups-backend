import {Component, Inject} from '@nestjs/common';
import {PlayerJoin} from './interfaces/player-join';
import {PlayersTypes} from './cups.constants';
import {CupPlayer} from './interfaces/cup-player';
import {BadRequestException} from '../exception/bad-request.exception';
import {Cup} from './interfaces/cup.interface';
import {ForbiddenException} from '../exception/forbidden.exception';
import {Model, Schema} from 'mongoose';
import ObjectId = Schema.Types.ObjectId;
import {CupModelToken} from '../core/constants';
import {TeamsService} from '../teams/teams.service';
import {UsersService} from '../users/users.service';
import {AUser} from '../authenticate/a-user';
import {Team} from '../teams/interfaces/team.interface';

@Component()
export class PlayersService {
  constructor(@Inject(CupModelToken) private readonly cupModel: Model<Cup>,
              private readonly teamsService: TeamsService,
              private readonly usersService: UsersService) {
  }

  public isPlayer(cup: Cup, id: string): boolean {
    return cup.players.some(value => value.id == id)
  }


  public async validPlayerTeam(team: Team, playerJoin: PlayerJoin) {
    if (!team || !playerJoin.lineup) throw new BadRequestException('invalid team');
    if (!this.teamsService.isTeamsPlayer(team, playerJoin.lineup)) throw new BadRequestException('Incorrect data');
    if (!this.teamsService.isCaptainInTeam(team, playerJoin.lineup)) throw new BadRequestException('no captain in team players');
    return team;
  }

  public async validPlayerUser(playerJoin: PlayerJoin) {
    let user = await this.usersService.findById(playerJoin.user);
    if (!user) throw new BadRequestException('invalid user id');
    return user
  }

  public getPlayerByCupType(cup: Cup, player: PlayerJoin, checkIn = false): CupPlayer {
    if (!player) throw new BadRequestException('invalid data');
    return cup.type == PlayersTypes.SOLO ? {id: player.user, checkIn: checkIn} : {
      id: player.team,
      lineup: player.lineup,
      checkIn: checkIn
    };
  }

  public async playerValidate(id: ObjectId, playerJoin: PlayerJoin, currentUserId: string, isAdmin: boolean = false): Promise<CupPlayer> {
    let cup = await this.cupModel.findById(id);
    if (!cup) throw new BadRequestException('invalid cup');

    let player = await this.basicValidPlayer(cup, playerJoin, currentUserId, isAdmin);

    if (cup.type == PlayersTypes.TEAM) {
      await this.validPlayerTeam(player, playerJoin);
    }

    let cupPlayer = this.getPlayerByCupType(cup, playerJoin, isAdmin);

    if (this.isPlayer(cup, cupPlayer.id)) {
      throw new BadRequestException('Duplicate data');
    }

    return cupPlayer;
  }

  public async basicValidPlayer(cup: Cup, playerJoin: PlayerJoin, currentUserId: string, isAdmin: boolean) {
    let player;
    if (cup.type == PlayersTypes.SOLO) {
      player = isAdmin ? await this.validPlayerUser(playerJoin) : await this.usersService.findById(currentUserId);
    } else {
      player = await this.teamsService.findById(playerJoin.team);
      if (!player) throw new BadRequestException('error team id');

      if (!isAdmin && !this.teamsService.isCreator(player, currentUserId)) {
        throw new ForbiddenException();
      }
    }

    return player;
  }
}