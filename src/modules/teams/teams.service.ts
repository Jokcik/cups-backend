import {Model, Schema} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamModelToken, UserModelName} from '../core/constants';
import {User} from '../users/interfaces/user.interface';
import {GGUtils} from '../core/gg-utils';
import {AUser} from '../authenticate/a-user';
import {BadRequestException} from '../exception/bad-request.exception';
import {UsersService} from '../users/users.service';
import {TeamShort} from "./interfaces/team.interface";
import * as _ from 'lodash'
import ObjectId = Schema.Types.ObjectId;

@Component()
export class TeamsService {
  private updateFields = ['title', 'url', 'status', 'logo', 'chat'];

  constructor(@Inject(TeamModelToken) private readonly teamModel: Model<TeamShort>,
              private readonly usersService: UsersService,
              private readonly ggUtils: GGUtils) {
  }

  public isCreator(team: TeamShort, userId: string): boolean {
    return team.ei_creator == userId;
  }

  public isTeamsPlayer(team: TeamShort, lineup: string[]) {
    let inter = _.intersection(team.players.map(value => value._id.toString()), lineup);
    return inter.length == lineup.length;
  }

  public isCaptainInTeam(team: TeamShort, players: string[]) {
    return _.includes(players, team.ei_creator);
  }

  async create(createTeamDto: CreateTeamDto, user: User): Promise<TeamShort> {
    let players = createTeamDto.players.map(userId => {return {player: userId, joined: 0}});
    Object.assign(createTeamDto, {ei_creator: user.id, captain: user.nickname, players,
      url: this.ggUtils.translit(createTeamDto.title)});


    const createdTeam = new this.teamModel(createTeamDto);
    return await createdTeam.save();
  }

  private combineUser(team): TeamShort {
    team.players.forEach((value: any, index) => {
      team.players[index] = Object.assign({}, value.toObject(), value.player.toObject());
      delete team.players[index].player;
    });
    return team;
  }

  async findAll(url: string, long: boolean): Promise<TeamShort[]> {
    if (url && long) {
      let team = await this.teamModel.findOne({url})
        .populate({path: 'players.player', model: UserModelName});

      return [this.combineUser(team)];
    }

    return await this.teamModel.find(url ? {url} : {})
  }

  async findById(id: Schema.Types.ObjectId | string): Promise<TeamShort> {
    return await this.teamModel.findById(id)
      .populate({path: 'players.player', model: UserModelName})
      .then(team =>  this.combineUser(team));
  }

  async update(id: ObjectId, createTeamDto: CreateTeamDto, user: AUser): Promise<TeamShort> {
    await this.validPlayerTeam(id, createTeamDto.addPlayers, createTeamDto.removePlayers);

    let addPlayers1 = createTeamDto.addPlayers.map(id => {return {player: id, joined: user.isAdmin() ? 1 : 0}});
    let removePlayers1 = createTeamDto.removePlayers;

    let team = this.ggUtils.selectFieldByObject(createTeamDto, this.updateFields);
    if (team.title) {
      Object.assign(team, {url: this.ggUtils.translit(team.title)})
    }

    return await this.teamModel.findByIdAndUpdate(id, team)
      .findOneAndUpdate(id, {$pull: {players: {player: {$in: removePlayers1}}}}, )
      .then(team => team.update({$push: {players: {$each: addPlayers1}}}, {new: true}));
  }

  async validPlayerTeam(id: ObjectId, addPlayers: string[], removePlayers: string[]) {
    addPlayers = addPlayers ? addPlayers : [];
    removePlayers = removePlayers ? removePlayers : [];

    let users = await this.usersService.findByManyId(_.concat(addPlayers, removePlayers));
    if (users.some(user => !user)) {
      throw new BadRequestException('error team player');
    }

    if(id) {
      let team = await this.teamModel.findById(id);
      if (!team) throw new BadRequestException('error team id');

      let idsCurrentPlayers = team.players.map(player => player.player.toString());

      // Если хоть один из игроков уже был в тиме, то ошибка
      if (_.intersection(idsCurrentPlayers, addPlayers).length != 0) {
        throw new BadRequestException('duplicate data')
      }

      // Если хоть один из игроков не был в в тиме, то ошибка
      if (_.intersection(idsCurrentPlayers, removePlayers).length != removePlayers.length) {
        throw new BadRequestException('player not in team')
      }
    }
  }

  async remove(id: Schema.Types.ObjectId): Promise<any> {
    let team = await this.teamModel.findByIdAndUpdate(id, {status: -1}, {new: true})
      .populate({path: 'players.player', model: UserModelName});
    return this.combineUser(team);
  }


  async restore(id: Schema.Types.ObjectId): Promise<any> {
    let team = await this.teamModel.findByIdAndUpdate(id, {status: 0}, {new: true})
      .populate({path: 'players.player', model: UserModelName});
    return this.combineUser(team);
  }

  async teamJoined(id: ObjectId, currentUser: AUser) {
    let team = await this.teamModel.findById(id);
    if (!team) throw new BadRequestException('error team id');

    if (!team.players.some((value: any) => value.player == currentUser.id)) {
      throw new BadRequestException('in team not current user');
    }

    team.players.forEach(user => {
      if (user.player == currentUser.id) {
        Object.assign(user, {joined: 1});
      }
    });

    return this.teamModel.findByIdAndUpdate(id, team, {new: true});
  }

}