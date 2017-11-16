import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards,} from '@nestjs/common';
import {CreateCupDto} from './dto/create-cup.dto';
import {CupsService} from './cups.service';
import {Cup} from './interfaces/cup.interface';
import {Schema} from 'mongoose';
import {TeamJoin} from '../teams/interfaces/team-join.interface';
import {CupRolesGuard} from './cup-roles.guard';
import {Roles, RolesTypes} from '../core/constants';
import {PlayerJoin} from './interfaces/player-join';
import {TeamsRolesGuard} from '../teams/teams-roles.guard';

@Controller('cups')
@UseGuards(CupRolesGuard)
export class CupsController {
  constructor(private readonly cupsService: CupsService) {
  }

  @Post()
  @Roles(RolesTypes.ALL)
  async create(@Body() createCupDto: CreateCupDto, @Request() req) {
    return this.cupsService.create(createCupDto, req.user);
  }

  @Put(':id')
  @Roles(RolesTypes.CREATOR, RolesTypes.ADMIN, RolesTypes.JUDGES)
  async update(@Param('id') id: Schema.Types.ObjectId, @Body() createCupDto: CreateCupDto): Promise<Cup> {
    return this.cupsService.update(id, createCupDto);
  }

  @Delete(':id')
  @Roles(RolesTypes.CREATOR, RolesTypes.ADMIN, RolesTypes.JUDGES)
  async remove(@Param('id') id: Schema.Types.ObjectId): Promise<void> {
    return this.cupsService.remove(id);
  }

  @Get()
  async findAll(): Promise<Cup[]> {
    return this.cupsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: Schema.Types.ObjectId): Promise<Cup> {
    return this.cupsService.findById(id);
  }

  @Post(':id/players')
  async addPlayers(@Param('id') id: Schema.Types.ObjectId, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.addPlayer(id, req.user, playerJoin);
  }

  @Post(':id/players/admin')
  @Roles(RolesTypes.CREATOR, RolesTypes.ADMIN, RolesTypes.JUDGES)
  async addPlayersAdmin(@Param('id') id: Schema.Types.ObjectId, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.addPlayer(id, req.user, playerJoin, true);
  }

  @Delete(':id/players/admin')
  @Roles(RolesTypes.CREATOR, RolesTypes.ADMIN, RolesTypes.JUDGES)
  async removePlayersAdmin(@Param('id') id: Schema.Types.ObjectId, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.removePlayer(id, req.user, playerJoin, true);
  }

  @Delete(':id/players')
  async removePlayers(@Param('id') id: Schema.Types.ObjectId, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.removePlayer(id, req.user, playerJoin);
  }

  @Get(':id/players')
  async findPlayers(@Param('id') id: Schema.Types.ObjectId): Promise<any> {
    return this.cupsService.findPlayers(id);
  }
}