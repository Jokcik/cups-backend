import {Controller, Get, Post, Body, Param, Request, Put, Delete, Query, UseGuards} from '@nestjs/common';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamsService} from './teams.service';
import {Schema} from 'mongoose';
import {Roles, RolesTypes} from '../core/constants';
import ObjectId = Schema.Types.ObjectId;
import {TeamShort} from "./interfaces/team.interface";
import {TeamsRolesGuard} from "./teams-roles.guard";

@Controller('teams')
@UseGuards(TeamsRolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamsService.create(createTeamDto, req.user);
  }

  @Post(':id/player')
  async addPlayer(@Param('id') id: ObjectId, @Body('player') player: string, @Request() req) {
    return this.teamsService.addPlayer(id, req.user, player);
  }

  @Post(':id/joined')
  async teamJoined(@Param('id') id: ObjectId, string, @Request() req) {
    return this.teamsService.teamJoined(id, req.user);
  }

  @Delete(':id/player')
  async removePlayer(@Param('id') id: ObjectId, @Body('player') player: string, @Request() req) {
    return this.teamsService.removePlayer(id, req.user, player);
  }

  @Put(':id')
  @Roles(RolesTypes.CREATOR)
  async update(@Param('id') id: Schema.Types.ObjectId, @Body() createCupDto: CreateTeamDto): Promise<TeamShort> {
    return this.teamsService.update(id, createCupDto);
  }

  @Delete(':id')
  @Roles(RolesTypes.CREATOR)
  async remove(@Param('id') id: Schema.Types.ObjectId): Promise<void> {
    return this.teamsService.remove(id);
  }

  @Get()
  async findAll(@Query('url') url: string, @Query('long') long: boolean): Promise<TeamShort[]> {
    return this.teamsService.findAll(url, long);
  }

  @Get(':id')
  async findById(@Param('id') id: Schema.Types.ObjectId): Promise<TeamShort> {
    return this.teamsService.findById(id);
  }
}