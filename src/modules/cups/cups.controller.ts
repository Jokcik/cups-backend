import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards,} from '@nestjs/common';
import {CreateCupDto} from './dto/create-cup.dto';
import {CupsService} from './cups.service';
import {CupRolesGuard} from './cup-roles.guard';
import {Roles, RolesTypes} from '../core/constants';
import {PlayerJoin} from './interfaces/player-join';
import {User} from '../users/interfaces/user.interface';
import {LongCup, ShortCup} from './interfaces/cup.interface';

@Controller('cups')
@UseGuards(CupRolesGuard)
export class CupsController {
  constructor(private readonly cupsService: CupsService) {
  }

  @Get('view')
  async findCupsGoes(@Request() req): Promise<any> {
    let goes = await this.cupsService.findCupsGoes();
    let closed = await this.cupsService.findCupsClosed();
    let opened = await this.cupsService.findCupsOpened();
    let myCups = await this.cupsService.findMyCups(req.user);

    return {goes, closed, opened, myCups};
  }

  @Post()
  async create(@Body() createCupDto: CreateCupDto, @Request() req) {
    return await this.cupsService.create(createCupDto, req.user);
  }

  @Put(':cupUrl')
  @Roles(RolesTypes.JUDGES)
  async update(@Param('cupUrl') url: string, @Body() createCupDto: CreateCupDto): Promise<ShortCup> {
    return this.cupsService.update(url, createCupDto);
  }

  @Delete(':cupUrl')
  @Roles(RolesTypes.JUDGES)
  async remove(@Param('cupUrl') url: string): Promise<void> {
    return this.cupsService.remove(url);
  }

  @Get()
  async findAll(@Request() req): Promise<ShortCup[]> {
    return this.cupsService.findAll();
  }

  @Get(':cupUrl')
  async findById(@Param('cupUrl') url: string): Promise<LongCup> {
    return this.cupsService.findByUrl(url);
  }

  @Post(':cupUrl/players')
  async addPlayers(@Param('cupUrl') url: string, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.addPlayer(url, req.user, playerJoin);
  }

  @Delete(':cupUrl/players')
  async removePlayers(@Param('cupUrl') url: string, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.removePlayer(url, req.user, playerJoin);
  }

  @Get(':cupUrl/players')
  async findPlayers(@Param('cupUrl') url: string): Promise<any> {
    return this.cupsService.findPlayers(url);
  }

  @Get(':cupUrl/judge')
  async findJudges(@Param('cupUrl') url: string): Promise<User[]> {
    return this.cupsService.findJudge(url);
  }

  @Post(':cupUrl/check-in')
  async checkIn(@Param('cupUrl') url: string, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.checkInPlayer(url, req.user, playerJoin);
  }

  @Post(':cupUrl/judge')
  @Roles(RolesTypes.CREATOR)
  async addJudge(@Param('cupUrl') url: string, @Body('judge') judge: string, @Request() req): Promise<any> {
    return this.cupsService.addJudge(url, judge);
  }

  @Delete(':cupUrl/judge')
  @Roles(RolesTypes.CREATOR)
  async removeJudge(@Param('cupUrl') url: string, @Body('judge') judge: string, @Request() req): Promise<any> {
    return this.cupsService.removeJudge(url, judge);
  }


}