import {Model} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {User} from './interfaces/user.interface';
import {CreateUserDto} from './dto/create-user.dto';
import {TeamModelToken, UserModelToken} from '../core/constants';
import fetch from 'node-fetch';
import {ShortTeam} from '../teams/interfaces/team.interface';

@Component()
export class UsersService {
  constructor(
    @Inject(UserModelToken) private readonly userModel: Model<User>,
    //TODO: переделать на teamService!!!
    @Inject(TeamModelToken) private readonly teamModel: Model<ShortTeam>) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findById(nickname: string): Promise<User> {
    if (!isNaN(+nickname)) {
      let user = await fetch('https://goodgame.ru/api/4/user/' + nickname)
        .then(res => res.json())
        .then(user => {
          user.nickname = user.username;
          delete user.id;

          return user;
        });
      return this.create(user);
    }

    return await this.userModel.findById(nickname);
  }

  async findTeams(nickname: string): Promise<ShortTeam[]> {
    return await this.teamModel.find({'players.player': {$in: [nickname]}});
  }
}