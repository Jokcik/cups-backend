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

@Component()
export class PlayersService {
  constructor(@Inject(CupModelToken) private readonly cupModel: Model<Cup>,
              private readonly teamsService: TeamsService,
              private readonly usersService: UsersService){
  }

  public isPlayer(cup: Cup, id: string): boolean {
    return cup.players.some(value => value.id == id)
  }


  public async validPlayerTeam(playerJoin: PlayerJoin, currentUserId: string, isAdmin: boolean) {
    let player = await this.teamsService.findById(playerJoin.team);

    if (!player || !playerJoin.lineup) throw new BadRequestException('invalid team');
    if (!this.teamsService.isTeamsPlayer(player, playerJoin.lineup)) throw new BadRequestException('Incorrect data');
    if (!isAdmin && !this.teamsService.isCreator(player, currentUserId)) throw new ForbiddenException();
    if (!this.teamsService.isCaptainInTeam(player, playerJoin.lineup)) throw new BadRequestException('no captain in team players');
    return player;
  }

  public async validPlayerUser(playerJoin: PlayerJoin) {
    let player = await this.usersService.findById(playerJoin.user);
    if (!player) throw new BadRequestException('invalid user id');
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

    if (cup.type == PlayersTypes.TEAM) {
      await this.validPlayerTeam(playerJoin, currentUserId, isAdmin);
    } else {
      await this.validPlayerUser(playerJoin);
    }

    let cupPlayer = this.getPlayerByCupType(cup, playerJoin, isAdmin);

    if (this.isPlayer(cup, cupPlayer.id)) {
      throw new BadRequestException('Duplicate data');
    }

    return cupPlayer;
  }
}