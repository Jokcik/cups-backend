import {Model, Schema} from 'mongoose';
import {Component, Inject, UseGuards} from '@nestjs/common';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamModelToken, UserModelName} from '../core/constants';
import {User} from '../users/interfaces/user.interface';
import * as _ from 'lodash'
import {GGUtils} from '../core/gg-utils';
import ObjectId = Schema.Types.ObjectId;
import {AUser} from '../authenticate/a-user';
import {BadRequestException} from '../exception/bad-request.exception';
import {UsersService} from '../users/users.service';
import {TeamShort} from "./interfaces/team.interface";

@Component()
export class TeamsService {
  private updateFields = ['title', 'url', 'status', 'players', 'logo', 'chat'];

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
    let users = createTeamDto.users.map(userId => {return {user: userId, joined: 0}});
    Object.assign(createTeamDto, {ei_creator: user.id, captain: user.nickname, users});
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

  async update(id: Schema.Types.ObjectId, createTeamDto: CreateTeamDto): Promise<TeamShort> {
    let team = this.ggUtils.selectFieldByObject(createTeamDto, this.updateFields);
    return await this.teamModel.findByIdAndUpdate(id, team, {new: true});
  }

  async remove(id: Schema.Types.ObjectId): Promise<any> {
    return this.teamModel.remove({_id: id})
  }

  async addPlayer(id: ObjectId, currentUser: AUser, playerId: string) {
    let team = await this.teamModel.findById(id);
    if (!team) throw new BadRequestException('error team id');

    let isAdmin = currentUser.isCreator();
    let teamUserId = currentUser.id;
    if (isAdmin && playerId) {
      if (!playerId) throw new BadRequestException('error body user');
      let user = await this.usersService.findById(playerId);
      if (!user) throw new BadRequestException('error body user');
      teamUserId = user.id;
    }

    if (team.players.some((value: any) => value.player == teamUserId)) {
      throw new BadRequestException('duplicate data');
    }

    let obj = {player: teamUserId, joined: 0};

    return this.teamModel.findByIdAndUpdate(id, {$push: {players: obj}}, {new: true})
      .populate({path: 'players.player', model: UserModelName})
      .then(team =>  this.combineUser(team).players);
  }

  async removePlayer(id: ObjectId, currentUser: AUser, playerId: string) {
    let team = await this.teamModel.findById(id);
    if (!team) throw new BadRequestException('error team id');

    let isAdmin = currentUser.isCreator();
    let teamUserId = currentUser.id;
    if (isAdmin && playerId) {
      let user = await this.usersService.findById(playerId);
      if (!user) throw new BadRequestException('error user id');
      teamUserId = user.id;
    }

    if (!team.players.some((value: any) => value.player == teamUserId)) {
      throw new BadRequestException('in team not user');
    }

    return this.teamModel.findByIdAndUpdate(id, {$pull: {players: {player: teamUserId}}}, {new: true})
      .then(team => team.players);
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