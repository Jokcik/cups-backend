import {Model, Schema} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {User} from './interfaces/user.interface';
import {CreateUserDto} from './dto/create-user.dto';
import {TeamModelToken, UserModelToken} from '../core/constants';
import {Team} from "../teams/interfaces/team.interface";
import fetch from 'node-fetch';
import ObjectId = Schema.Types.ObjectId;

@Component()
export class UsersService {
  constructor(@Inject(UserModelToken) private readonly userModel: Model<User>,
              //TODO: переделать на teamService!!!
              @Inject(TeamModelToken) private readonly teamModel: Model<Team>) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdCat = new this.userModel(createUserDto);
    return await createdCat.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findById(id: ObjectId | string): Promise<User> {
    if (!isNaN(+id)) {
      let user = await fetch('https://goodgame.ru/api/4/user/' + id)
        .then(res => res.json())
        .then(user => {
          user.nickname = user.username;
          delete user.id;

          return user;
        });
      return this.create(user);
    }

    return await this.userModel.findById(id);
  }

  async findTeams(id: ObjectId): Promise<Team[]> {
    return await this.teamModel.find({'users.user': {$in: [id]}});
  }
}