import {Model, Schema} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamModelToken, UserModelName} from '../core/constants';
import {User} from '../users/interfaces/user.interface';
import * as _ from 'lodash'
import {GGUtils} from '../core/gg-utils';
import ObjectId = Schema.Types.ObjectId;
import {AUser} from '../authenticate/a-user';
import {BadRequestException} from '../exception/bad-request.exception';
import {UsersService} from '../users/users.service';
import {Team} from "./interfaces/team.interface";

@Component()
export class TeamsService {
  private updateFields = ['title', 'url', 'status', 'players', 'logo', 'chat'];

  constructor(@Inject(TeamModelToken) private readonly teamModel: Model<Team>,
              private readonly usersService: UsersService,
              private readonly ggUtils: GGUtils) {
  }

  public isCreator(team: Team, userId: string): boolean {
    return team.ei_creator == userId;
  }

  public isTeamsPlayer(team: Team, lineup: string[]) {
    let inter = _.intersection(team.players.map(value => value._id.toString()), lineup);
    return inter.length == lineup.length;
  }

  public isCaptainInTeam(team: Team, players: string[]) {
    return _.includes(players, team.ei_creator);
  }

  async create(createTeamDto: CreateTeamDto, user: User): Promise<Team> {
    let users = createTeamDto.users.map(userId => {return {user: userId, joined: 0}});
    Object.assign(createTeamDto, {ei_creator: user.id, users});
    const createdTeam = new this.teamModel(createTeamDto);
    return await createdTeam.save();
  }

  private combineUser(team): Team {
    team.players.forEach((value: any, index) => {
      team.players[index] = Object.assign({}, value.toObject(), value.user.toObject());
      delete team.players[index].user;
    });
    return team;
  }

  async findAll(): Promise<Team[]> {
    return await this.teamModel.find()
  }

  async findById(id: Schema.Types.ObjectId | string): Promise<Team> {
    return await this.teamModel.findById(id)
      .populate({path: 'users.user', model: UserModelName})
      .then(team =>  this.combineUser(team));
  }

  async update(id: Schema.Types.ObjectId, createTeamDto: CreateTeamDto): Promise<Team> {
    let team = this.ggUtils.selectFieldByObject(createTeamDto, this.updateFields);
    return await this.teamModel.findByIdAndUpdate(id, team, {new: true});
  }

  async remove(id: Schema.Types.ObjectId): Promise<any> {
    return this.teamModel.remove({_id: id})
  }

  async addUser(id: ObjectId, currentUser: AUser, userId: string) {
    let team = await this.teamModel.findById(id);
    if (!team) throw new BadRequestException('error team id');

    let isAdmin = currentUser.isCreator();
    let teamUserId = currentUser.id;
    if (isAdmin && userId) {
      if (!userId) throw new BadRequestException('error body user');
      let user = await this.usersService.findById(userId);
      if (!user) throw new BadRequestException('error body user');
      teamUserId = user.id;
    }

    if (team.players.some((value: any) => value.user == teamUserId)) {
      throw new BadRequestException('duplicate data');
    }

    let obj = {user: teamUserId, joined: 0};

    return this.teamModel.findByIdAndUpdate(id, {$push: {users: obj}}, {new: true});
  }

  async removeUser(id: ObjectId, currentUser: AUser, userId: string) {
    let team = await this.teamModel.findById(id);
    if (!team) throw new BadRequestException('error team id');

    let isAdmin = currentUser.isCreator();
    let teamUserId = currentUser.id;
    if (isAdmin && userId) {
      let user = await this.usersService.findById(userId);
      if (!user) throw new BadRequestException('error user id');
      teamUserId = user.id;
    }

    if (!team.players.some((value: any) => value.user == teamUserId)) {
      throw new BadRequestException('in team not user');
    }

    return this.teamModel.findByIdAndUpdate(id, {$pull: {users: {user: teamUserId}}}, {new: true});
  }

  async teamJoined(id: ObjectId, currentUser: AUser) {
    let team = await this.teamModel.findById(id);
    if (!team) throw new BadRequestException('error team id');

    if (!team.players.some((value: any) => value.user == currentUser.id)) {
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