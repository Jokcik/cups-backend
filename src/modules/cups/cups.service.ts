import {Model, Schema} from 'mongoose';
import {Component, HttpStatus, Inject} from '@nestjs/common';
import {Cup} from './interfaces/cup.interface';
import {CreateCupDto} from './dto/create-cup.dto';
import {CupModelToken, TeamModelName, UserModelName} from '../constants';
import {Team} from '../teams/interfaces/team.interface';
import {User} from '../users/interfaces/user.interface';
import {TeamJoin} from '../teams/interfaces/team-join.interface';
import {PlayersTypes} from './cups.constants';
import {CupPlayer} from './interfaces/cup-player';
import {BadRequestException} from '../exception/bad-request.exception';
import {TeamsService} from '../teams/teams.service';
import {ForbiddenException} from '../exception/forbidden.exception';

@Component()
export class CupsService {
  constructor(@Inject(CupModelToken) private readonly cupModel: Model<Cup>,
              private readonly teamsService: TeamsService) {
  }

  public isPlayer(cup: Cup, id: string): boolean {
    return cup.players.some(value => value.id == id)
  }

  public isJudges(cup: Cup, id: string): boolean {
    return cup.judges.some(value => value.id == id);
  }

  public isCreator(cup: Cup, id: string): boolean {
    return cup.ei_creator == id;
  }

  async create(createCupDto: CreateCupDto, user: User): Promise<Cup> {
    Object.assign(createCupDto, {ei_creator: user.id});
    const createdCup = new this.cupModel(createCupDto);
    return await createdCup.save();
  }

  async update(id: Schema.Types.ObjectId, createCupDto: CreateCupDto): Promise<Cup> {
    return await this.cupModel.findByIdAndUpdate(id, createCupDto, {new: true});
  }

  async findById(id: Schema.Types.ObjectId): Promise<Cup> {
    let cup = await this.cupModel.findById(id).populate('game').exec();

    return await this.populatePlayers(cup);
  }

  async populatePlayers(cup) {
    return cup
      .populate({path: 'players.id', model: cup.type == PlayersTypes.SOLO ? UserModelName : TeamModelName})
      .execPopulate()
      .then(cup => {
        cup.players.forEach((value: any, index) => {
          cup.players[index] = Object.assign({}, value.toObject(), value.id.toObject());
          delete (<any>cup.players[index]).id;
        });

        return cup;
      });
  }

  async findAll(): Promise<Cup[]> {
    return await this.cupModel.find()
  }

  async remove(id: Schema.Types.ObjectId): Promise<any> {
    return this.cupModel.remove({_id: id})
  }

  private getPlayer(cup: Cup, currentUser: User, teamJoin?: TeamJoin): CupPlayer {
    return cup.type == PlayersTypes.SOLO ? {id: currentUser.id} : {id: teamJoin.team, lineup: teamJoin.players};
  }

  async addPlayer(id: Schema.Types.ObjectId, currentUser: User, teamJoin: TeamJoin = null): Promise<(User | Team)[]> {
    let cup = await this.cupModel.findById(id);
    if (!cup) {
      throw new BadRequestException('invalid cup id')
    }

    let cupPlayer = this.getPlayer(cup, currentUser, teamJoin);

    if (cup.type == PlayersTypes.TEAM) {
      let team = await this.teamsService.findById(teamJoin.team);

      if (!team || !this.teamsService.isTeamsPlayer(team, teamJoin.players)) {
        throw new BadRequestException('Incorrect data');
      }

      if (!this.teamsService.isCreator(team, currentUser)) {
        throw new ForbiddenException();
      }
    }

    if (this.isPlayer(cup, cupPlayer.id)) {
      throw new BadRequestException('Duplicate data');
    }

    return await this.cupModel
      .findByIdAndUpdate(id, {$push: {players: cupPlayer}}, {upsert: true, new: true})
      .then(cup => cup.players);
  }

  async removePlayer(id: Schema.Types.ObjectId, currentUser: User, teamJoin: TeamJoin = null): Promise<(User | Team)[]> {
    let cup = await this.cupModel.findById(id);
    let value = this.getPlayer(cup, currentUser, teamJoin);

    return await this.cupModel
      .findByIdAndUpdate(id, {$pull: {players: {id: value.id}}}, {upsert: true, new: true})
      .then(cup => cup.players);
  }

  async findPlayers(id: Schema.Types.ObjectId): Promise<(User | Team)[]> {
    return await this.findById(id).then(cup => cup.players)
  }


}