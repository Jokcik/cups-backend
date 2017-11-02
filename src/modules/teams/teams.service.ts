import {Model, Schema} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {Team} from './interfaces/team.interface';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamModelToken} from '../constants';
import {User} from '../users/interfaces/user.interface';
import * as _ from 'lodash'

@Component()
export class TeamsService {
  constructor(@Inject(TeamModelToken) private readonly teamModel: Model<Team>) {
  }

  public isCreator(team: Team, user: User): boolean {
    return team.ei_creator == user.id;
  }

  public isTeamsPlayer(team: Team, lineup: string[]) {
    let inter = _.intersection(team.users.map(value => value.user.toString()), lineup);
    return inter.length == lineup.length;
  }

  async create(createTeamDto: CreateTeamDto, user: User): Promise<Team> {
    Object.assign(createTeamDto, {ei_creator: user.id});
    const createdCat = new this.teamModel(createTeamDto);
    return await createdCat.save();
  }

  async findAll(): Promise<Team[]> {
    return await this.teamModel.find();
  }

  async findById(id: Schema.Types.ObjectId | string) {
    return await this.teamModel.findById(id);
  }

  async update(id: Schema.Types.ObjectId, createTeamDto: CreateTeamDto): Promise<Team> {
    return await this.teamModel.findByIdAndUpdate(id, createTeamDto, {new: true});
  }

  async remove(id: Schema.Types.ObjectId): Promise<any> {
    return this.teamModel.remove({_id: id})
  }

}