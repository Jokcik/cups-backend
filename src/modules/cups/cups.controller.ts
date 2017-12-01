import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards,} from '@nestjs/common';
import {CreateCupDto} from './dto/create-cup.dto';
import {CupsService} from './cups.service';
import {Schema} from 'mongoose';
import {CupRolesGuard} from './cup-roles.guard';
import {Roles, RolesTypes} from '../core/constants';
import {PlayerJoin} from './interfaces/player-join';
import ObjectId = Schema.Types.ObjectId;
import {User} from '../users/interfaces/user.interface';
import {LongCup, ShortCup} from "./interfaces/cup.interface";

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

  @Put(':cupId')
  @Roles(RolesTypes.JUDGES)
  async update(@Param('cupId') id: ObjectId, @Body() createCupDto: CreateCupDto): Promise<ShortCup> {
    return this.cupsService.update(id, createCupDto);
  }

  @Delete(':cupId')
  @Roles(RolesTypes.JUDGES)
  async remove(@Param('cupId') id: ObjectId): Promise<void> {
    return this.cupsService.remove(id);
  }

  @Get()
  async findAll(@Query('url') url: string, @Query('long') long: boolean): Promise<ShortCup[]> {
    return this.cupsService.findAll(url, long);
  }

  @Get(':cupId')
  async findById(@Param('cupId') id: ObjectId): Promise<LongCup> {
    return this.cupsService.findById(id);
  }

  @Post(':cupId/players')
  async addPlayers(@Param('cupId') id: ObjectId, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.addPlayer(id, req.user, playerJoin);
  }

  @Delete(':cupId/players')
  async removePlayers(@Param('cupId') id: ObjectId, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.removePlayer(id, req.user, playerJoin);
  }

  @Get(':cupId/players')
  async findPlayers(@Param('cupId') id: ObjectId): Promise<any> {
    return this.cupsService.findPlayers(id);
  }

  @Get(':cupId/judge')
  async findJudges(@Param('cupId') id: ObjectId): Promise<User[]> {
    return this.cupsService.findJudge(id);
  }

  @Post(':cupId/check-in')
  async checkIn(@Param('cupId') id: ObjectId, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.checkInPlayer(id, req.user, playerJoin);
  }

  @Post(':cupId/judge')
  @Roles(RolesTypes.CREATOR)
  async addJudge(@Param('cupId') id: ObjectId, @Body('judge') judge: ObjectId, @Request() req): Promise<any> {
    return this.cupsService.addJudge(id, judge);
  }

  @Delete(':cupId/judge')
  @Roles(RolesTypes.CREATOR)
  async removeJudge(@Param('cupId') id: ObjectId, @Body('judge') judge: ObjectId, @Request() req): Promise<any> {
    return this.cupsService.removeJudge(id, judge);
  }


}