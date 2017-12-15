import {Model, Schema, Types} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {User} from './interfaces/user.interface';
import {CreateUserDto} from './dto/create-user.dto';
import {TeamModelToken, UserModelToken} from '../core/constants';
import {TeamShort} from "../teams/interfaces/team.interface";
import fetch from 'node-fetch';
import ObjectId = Schema.Types.ObjectId;

@Component()
export class UsersService {
  constructor(@Inject(UserModelToken) private readonly userModel: Model<User>,
              //TODO: переделать на teamService!!!
              @Inject(TeamModelToken) private readonly teamModel: Model<TeamShort>) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdCat = new this.userModel(createUserDto);
    return await createdCat.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findByManyId(ids: string[]) {
    return this.userModel.find({_id: {$in: ids}});
  }

  async findById(id: ObjectId | string): Promise<User> {
    if (!isNaN(+id)) {
      let user = await fetch('https://goodgame.ru/api/4/user/' + id)
        .then(res => res.json())
        .then(user => {
          user.nickname = user.username;
          user.logo = "https://goodgame.ru" + user.avatar;
          delete user.id;

          return user;
        });
      return this.create(user);
    }

    return await this.userModel.findById(id);
  }

  async findTeams(id: ObjectId): Promise<TeamShort[]> {
    console.log('123');
    return await this.teamModel.find({'players.player': {$in: [id]}});
  }

  async findPlayers(search: string, limit: number) {
    let users = await this.userModel.find({nickname: {$regex: search, $options: "i"}}).limit(limit);
    return users.map(user => {return {title: user.nickname, object: user}})
  }
}