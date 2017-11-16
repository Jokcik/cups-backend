import {Model, Schema} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {Cup} from './interfaces/cup.interface';
import {CreateCupDto} from './dto/create-cup.dto';
import {CupModelToken, TeamModelName, UserModelName} from '../core/constants';
import {Team} from '../teams/interfaces/team.interface';
import {User} from '../users/interfaces/user.interface';
import {PlayersTypes} from './cups.constants';
import {CupPlayer} from './interfaces/cup-player';
import {BadRequestException} from '../exception/bad-request.exception';
import {TeamsService} from '../teams/teams.service';
import {ForbiddenException} from '../exception/forbidden.exception';
import {UsersService} from '../users/users.service';
import {GGUtils} from '../core/gg-utils';
import {PlayerJoin} from './interfaces/player-join';
import ObjectId = Schema.Types.ObjectId;
import {PlayersService} from './players.service';

@Component()
export class CupsService {
  private updateFields = ['description', 'type', 'url', 'start', 'logo', 'prize_pool',
    'chat', 'game', 'closed', 'invites', 'hidden', 'deleted'];

  constructor(@Inject(CupModelToken) private readonly cupModel: Model<Cup>,
              private readonly teamsService: TeamsService,
              private readonly ggUtils: GGUtils,
              private readonly playersService: PlayersService) {
  }

  public isJudges(cup: Cup, id: string): boolean {
    return cup.judges.some(value => value.id == id);
  }

  public isCreator(cup: Cup, id: string): boolean {
    return cup.ei_creator == id;
  }

  async create(createCupDto: CreateCupDto, user: User): Promise<Cup> {
    Object.assign(createCupDto, {ei_creator: user.id, ei_created: Date.now()});
    const createdCup = new this.cupModel(createCupDto);
    return await createdCup.save();
  }

  //TODO: проверить
  async update(id: ObjectId, createCupDto: CreateCupDto): Promise<Cup> {
    let cup = await this.cupModel.findById(id);
    if (createCupDto.type != cup.type) {
      this.updateFields = this.updateFields.filter(value => value != 'type');
    }
    createCupDto = this.ggUtils.selectFieldByObject(createCupDto, this.updateFields);

    return await this.cupModel.findByIdAndUpdate(id, createCupDto, {new: true});
  }

  async findById(id: ObjectId): Promise<Cup> {
    let cup = await this.cupModel.findById(id).populate('game').exec();

    return await this.populatePlayers(cup);
  }

  async populatePlayers(cup) {
    return cup
      .populate({path: 'players.id', model: cup.type == PlayersTypes.SOLO ? UserModelName : TeamModelName})
      .execPopulate()
      .then(cup => {
        cup.lineup.forEach((value: any, index) => {
          cup.lineup[index] = Object.assign({}, value.toObject(), value.id.toObject());
          delete (<any>cup.lineup[index]).id;
        });

        return cup;
      });
  }

  async findAll(): Promise<Cup[]> {
    return await this.cupModel.find()
  }

  async remove(id: ObjectId): Promise<any> {
    return this.cupModel.remove({_id: id})
  }

  async addPlayer(id: ObjectId, currentUser: User, playerJoin: PlayerJoin, isAdmin = false): Promise<(User | Team)[]> {
    let cupPlayer = await this.playersService.playerValidate(id, playerJoin, currentUser.id, isAdmin);

    return await this.cupModel
      .findByIdAndUpdate(id, {$push: {players: cupPlayer}}, {upsert: true, new: true})
      .then(cup => cup.players);
  }

  async removePlayer(id: ObjectId, currentUser: User, playerJoin: PlayerJoin, isAdmin = false): Promise<(User | Team)[]> {
    let cup = await this.cupModel.findById(id);
    if (!cup) throw new BadRequestException('invalid cup');

    if (!isAdmin){
      if (cup.type == PlayersTypes.TEAM) {
        let team = await this.teamsService.findById(playerJoin.team);
        if (!this.teamsService.isCreator(team, currentUser.id)) throw new ForbiddenException();
      } else {
        playerJoin = <any>{user: currentUser.id};
      }
    }

    let value = this.playersService.getPlayerByCupType(cup, playerJoin);

    return await this.cupModel
      .findByIdAndUpdate(id, {$pull: {players: {id: value.id}}}, {upsert: true, new: true})
      .then(cup => cup.players);
  }

  async findPlayers(id: ObjectId): Promise<(User | Team)[]> {
    return await this.findById(id).then(cup => cup.players)
  }


}