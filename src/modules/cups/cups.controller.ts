import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards,} from '@nestjs/common';
import {CreateCupDto} from './dto/create-cup.dto';
import {CupsService} from './cups.service';
import {Cup} from './interfaces/cup.interface';
import {Schema} from 'mongoose';
import {CupRolesGuard} from './cup-roles.guard';
import {Roles, RolesTypes} from '../core/constants';
import {PlayerJoin} from './interfaces/player-join';
import ObjectId = Schema.Types.ObjectId;

@Controller('cups')
@UseGuards(CupRolesGuard)
export class CupsController {
  constructor(private readonly cupsService: CupsService) {
  }

  @Post()
  async create(@Body() createCupDto: CreateCupDto, @Request() req) {
    return await this.cupsService.create(createCupDto, req.user);
  }

  @Put(':cupId')
  @Roles(RolesTypes.JUDGES)
  async update(@Param('cupId') id: ObjectId, @Body() createCupDto: CreateCupDto): Promise<Cup> {
    return this.cupsService.update(id, createCupDto);
  }

  @Delete(':cupId')
  @Roles(RolesTypes.JUDGES)
  async remove(@Param('cupId') id: ObjectId): Promise<void> {
    return this.cupsService.remove(id);
  }

  @Get()
  async findAll(@Request() req): Promise<Cup[]> {
    return this.cupsService.findAll();
  }

  @Get(':cupId')
  async findById(@Param('cupId') id: ObjectId): Promise<Cup> {
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

  @Post(':cupId/check-in')
  async checkIn(@Param('cupId') id: ObjectId, @Body() playerJoin: PlayerJoin, @Request() req): Promise<any> {
    return this.cupsService.checkInPlayer(id, req.user, playerJoin);
  }
}