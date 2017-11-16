import {Model, Schema} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {User} from './interfaces/user.interface';
import {CreateUserDto} from './dto/create-user.dto';
import {TeamModelToken, UserModelToken} from '../core/constants';
import {Team} from '../teams/interfaces/team.interface';

@Component()
export class UsersService {
  constructor(
    @Inject(UserModelToken) private readonly userModel: Model<User>,
    @Inject(TeamModelToken) private readonly teamModel: Model<Team>) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdCat = new this.userModel(createUserDto);
    return await createdCat.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findById(id: Schema.Types.ObjectId | string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findTeams(id: Schema.Types.ObjectId): Promise<Team[]> {
    return await this.teamModel.find({'users.user': {$in: [id]}});
  }
}