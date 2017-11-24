import {Model} from 'mongoose';
import {Component, Inject} from '@nestjs/common';
import {CreateCupDto} from './dto/create-cup.dto';
import {CupModelToken, TeamModelName, UserModelName} from '../core/constants';
import {User} from '../users/interfaces/user.interface';
import {PlayersTypes} from './cups.constants';
import {BadRequestException} from '../exception/bad-request.exception';
import {TeamsService} from '../teams/teams.service';
import {GGUtils} from '../core/gg-utils';
import {PlayerJoin} from './interfaces/player-join';
import {PlayersService} from './players.service';
import {AUser} from '../authenticate/a-user';
import {UsersService} from '../users/users.service';
import {ShortTeam} from '../teams/interfaces/team.interface';
import {LongCup, ShortCup} from './interfaces/cup.interface';
import {CupPlayer} from './interfaces/cup-player';

@Component()
export class CupsService {
  private updateFields = ['description', 'type', 'url', 'start', 'logo', 'prize_pool',
    'chat', 'game', 'closed', 'invites', 'hidden', 'deleted'];

  constructor(@Inject(CupModelToken) private readonly cupModel: Model<ShortCup>,
              private readonly teamsService: TeamsService,
              private readonly usersService: UsersService,
              private readonly ggUtils: GGUtils,
              private readonly playersService: PlayersService) {
  }

  public isJudges(cup: LongCup, id: string): boolean {
    return cup.judges.some(value => value.id == id);
  }

  public isCreator(cup: ShortCup | LongCup, id: string): boolean {
    return cup.ei_creator == id;
  }

  async create(createCupDto: CreateCupDto, user: AUser): Promise<ShortCup> {
    Object.assign(createCupDto, {ei_creator: user.id, ei_created: Date.now()});
    const createdCup = new this.cupModel(createCupDto);
    return await createdCup.save();
  }

  async update(cupUrl: string, createCupDto: CreateCupDto): Promise<ShortCup> {
    let cup = await this.cupModel.findOne({url: cupUrl});
    if (createCupDto.type != cup.type) {
      this.updateFields = this.updateFields.filter(value => value != 'type');
    }
    createCupDto = this.ggUtils.selectFieldByObject(createCupDto, this.updateFields);

    return await this.cupModel.findByIdAndUpdate(cupUrl, createCupDto, {new: true});
  }

  async findByUrl(cupUrl: string): Promise<LongCup> {
    let cup = await this.cupModel.findOne({url: cupUrl}).populate('games');
    return await this.populatePlayers(cup);
  }

  async populatePlayers(cup) {
    return cup
      .populate({path: 'players.id', model: cup.type == PlayersTypes.SOLO ? UserModelName : TeamModelName, key: 'url'})
      .execPopulate()
      .then(cup => {
        cup.players.forEach((value: any, index) => {
          cup.players[index] = Object.assign({}, value.toObject(), value.id.toObject());
          delete (<any>cup.players[index]).id;
        });

        return cup;
      });
  }

  async findAll(): Promise<ShortCup[]> {
    return await this.cupModel.find()
  }

  async remove(cupUrl: string): Promise<any> {
    return this.cupModel.remove({_id: cupUrl})
  }

  async addPlayer(cupUrl: string, currentUser: AUser, playerJoin: PlayerJoin): Promise<CupPlayer[]> {
    let isAdmin = currentUser.isJudge();
    let cupPlayer = await this.playersService.playerValidate(cupUrl, playerJoin, currentUser.id, isAdmin);

    return await this.cupModel
      .findByIdAndUpdate(cupUrl, {$push: {players: cupPlayer}}, {upsert: true, new: true})
      .then(cup => cup.players);
  }

  async removePlayer(cupUrl: string, currentUser: AUser, playerJoin: PlayerJoin): Promise<CupPlayer[]> {
    let isAdmin = currentUser.isJudge();
    let cup = await this.cupModel.findOne({url: cupUrl});
    if (!cup) throw new BadRequestException('invalid cup');

    await this.playersService.basicValidPlayer(cup, playerJoin, currentUser.id, isAdmin);
    if (!isAdmin && cup.type != PlayersTypes.TEAM) {
      playerJoin = <any>{user: currentUser.id};
    }

    let value = this.playersService.getPlayerByCupType(cup, playerJoin);

    return await this.cupModel
      .findByIdAndUpdate(cupUrl, {$pull: {players: {id: value.id}}}, {upsert: true, new: true})
      .then(cup => cup.players);
  }

  async findPlayers(cupUrl: string): Promise<(User | ShortTeam)[]> {
    return await this.findByUrl(cupUrl).then(cup => cup.players)
  }


  async checkInPlayer(cupUrl: string, user: AUser, playerJoin: PlayerJoin) {
    let isAdmin = user.isJudge();
    let cup = await this.cupModel.findOne({url: cupUrl});
    if (!cup) throw new BadRequestException('invalid cup');

    let player = await this.playersService.basicValidPlayer(cup, playerJoin, user.id, isAdmin);

    cup.players.forEach(value => {
      if (value.id == player.id) {
        (<any>value).checkIn = true;
      }
    });

    return await this.cupModel.findByIdAndUpdate(cupUrl, cup, {new: true});
  }

  async addJudge(cupUrl: string, judgeId: string) {
    let cup = await this.cupModel.findOne({url: cupUrl});
    if (!cup) throw new BadRequestException('invalid cup id');

    let user = await this.usersService.findById(judgeId);
    if (!user) throw new BadRequestException('invalid judge id');

    if ((<any[]>cup.judges).some(judge => judge == judgeId)) {
      throw new BadRequestException('Duplicate data')
    }

    return await this.cupModel.findByIdAndUpdate(cupUrl, {$push: {judges: judgeId}}, {upsert: true, new: true})
  }

  async removeJudge(cupUrl: string, judgeId: string) {
    let cup = await this.cupModel.findOne({url: cupUrl});
    if (!cup) throw new BadRequestException('invalid cup id');

    let user = await this.usersService.findById(judgeId);
    if (!user) throw new BadRequestException('invalid judge id');

    if (!(<any[]>cup.judges).some(judge => judge == judgeId)) {
      throw new BadRequestException('judge not in cup')
    }

    return await this.cupModel.findByIdAndUpdate(cupUrl, {$pull: {judges: judgeId}}, {upsert: true, new: true})
  }

  async findJudge(cupUrl: string): Promise<User[]> {
    return await this.cupModel.findOne({url: cupUrl}).populate({path: 'judges', model: UserModelName}).then(cup => <any[]>cup.judges)
  }

  async findCupsGoes() {
    return this.cupModel.find()
      .where('closed', false)
      .where('start').lt(Date.now());
  }

  async findCupsClosed() {
    return this.cupModel.find()
      .where('closed', true)
  }

  async findCupsOpened() {
    return this.cupModel.find()
      .where('closed', false)
      .where('start').gt(Date.now());
  }

  async findMyCups(user: AUser) {
    if (!user) return [];

    return this.cupModel.find()
      .or([
        {ei_creator: user.id},
        {'players.id': user.id}
      ])
  }
}