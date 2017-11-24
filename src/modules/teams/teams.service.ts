import {Model} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamModelToken, UserModelName} from '../core/constants';
import * as _ from 'lodash'
import {GGUtils} from '../core/gg-utils';
import {AUser} from '../authenticate/a-user';
import {BadRequestException} from '../exception/bad-request.exception';
import {UsersService} from '../users/users.service';
import {LongTeam, ShortTeam} from './interfaces/team.interface';

@Component()
export class TeamsService {
  private updateFields = ['title', 'status', 'logo', 'chat'];

  constructor(@Inject(TeamModelToken) private readonly teamModel: Model<ShortTeam>,
              private readonly usersService: UsersService,
              private readonly ggUtils: GGUtils) {
  }

  public isCreator(team: ShortTeam | LongTeam, playerId: string): boolean {
    return team.ei_creator == playerId;
  }

  public isTeamsPlayer(team: ShortTeam, lineup: string[]) {
    let inter = _.intersection(team.players.map(value => value._id.toString()), lineup);
    return inter.length == lineup.length;
  }

  public isCaptainInTeam(team: ShortTeam, players: string[]) {
    return _.includes(players, team.ei_creator);
  }

  async create(team: ShortTeam, currentUser: AUser): Promise<ShortTeam> {
    let players = team.players.map(playerId => {return {player: playerId, joined: 0}});
    Object.assign(team, {ei_creator: currentUser.id, players});
    const createdTeam = new this.teamModel(team);
    return await createdTeam.save();
  }

  private combineUser(team): LongTeam {
    team.players.forEach((value: any, index) => {
      team.players[index] = Object.assign({}, value.toObject(), value.player.toObject());
      delete team.players[index].player;
    });
    return team;
  }

  async findAll(): Promise<ShortTeam[]> {
    return await this.teamModel.find()
  }

  async findById(teamUrl: string): Promise<LongTeam> {
    return await this.teamModel.findById(teamUrl)
      .populate({path: 'players.player', model: UserModelName})
      .then(team =>  this.combineUser(team));
  }

  async update(teamUrl: string, createTeamDto: CreateTeamDto): Promise<ShortTeam> {
    let team = this.ggUtils.selectFieldByObject(createTeamDto, this.updateFields);
    return await this.teamModel.findByIdAndUpdate(teamUrl, team, {new: true});
  }

  async remove(teamUrl: string): Promise<any> {
    return this.teamModel.remove({teamUrl})
  }

  async addPlayer(teamUrl: string, currentUser: AUser, playerId: string) {
    let team = await this.teamModel.findById(teamUrl);
    if (!team) throw new BadRequestException('error team id');

    let isAdmin = currentUser.isCreator();
    let teamPlayerId = currentUser.id;
    if (isAdmin && playerId) {
      if (!playerId) throw new BadRequestException('error body user');
      let user = await this.usersService.findById(playerId);
      if (!user) throw new BadRequestException('error body user');
      teamPlayerId = user.id;
    }

    if (team.players.some((value: any) => value.player == teamPlayerId)) {
      throw new BadRequestException('duplicate data');
    }

    let obj = {player: teamPlayerId, joined: 0};

    return this.teamModel.findByIdAndUpdate(teamUrl, {$push: {players: obj}}, {new: true});
  }

  async removePlayer(teamUrl: string, currentUser: AUser, playerId: string) {
    let team = await this.teamModel.findById(teamUrl);
    if (!team) throw new BadRequestException('error team id');

    let isAdmin = currentUser.isCreator();
    let teamPlayerId = currentUser.id;
    if (isAdmin && playerId) {
      let user = await this.usersService.findById(playerId);
      if (!user) throw new BadRequestException('error user id');
      teamPlayerId = user.id;
    }

    if (!team.players.some((value: any) => value.player == teamPlayerId)) {
      throw new BadRequestException('in team not user');
    }

    return this.teamModel.findByIdAndUpdate(teamUrl, {$pull: {players: {player: teamPlayerId}}}, {new: true});
  }

  async teamJoined(teamUrl: string, currentUser: AUser) {
    let team = await this.teamModel.findById(teamUrl);
    if (!team) throw new BadRequestException('error team id');

    if (!team.players.some((value: any) => value.player == currentUser.id)) {
      throw new BadRequestException('in team not current user');
    }

    team.players.forEach(player => {
      if (player.player == currentUser.id) {
        Object.assign(player, {joined: 1});
      }
    });

    return this.teamModel.findByIdAndUpdate(teamUrl, team, {new: true});
  }

}