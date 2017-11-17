import {Model, Schema} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {Game} from './interfaces/game.interface';
import {CreateGameDto} from './dto/create-game.dto';
import {GameModelToken} from '../core/constants';
import fetch from 'node-fetch';

@Component()
export class GamesService {
  constructor(@Inject(GameModelToken) private readonly gameModel: Model<Game>) {
  }

  async updateAllGames(): Promise<any> {
    let games = await fetch('https://goodgame.ru/api/4/stream/games?filter=cups')
      .then(res => res.json())
      .then(res => res.games);

    let all = games.map(game => this.gameModel.findOneAndUpdate({title: game.title}, game, {upsert: true, new: true}));

    return await Promise.all(all);
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const createdCat = new this.gameModel(createGameDto);
    return await createdCat.save();
  }

  async update(id: Schema.Types.ObjectId, createGameDto: CreateGameDto): Promise<Game> {
    return await this.gameModel.findByIdAndUpdate(id, createGameDto, {upsert: true, new: true});
  }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find();
  }

  async findById(id: Schema.Types.ObjectId): Promise<Game> {
    return this.gameModel.findById(id);
  }

  async remove(id: Schema.Types.ObjectId): Promise<any> {
    return this.gameModel.remove({_id: id});
  }
}