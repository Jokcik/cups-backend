import {Controller, Get, Post, Body, Param, Request, Put, Delete} from '@nestjs/common';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamsService} from './teams.service';
import {Roles, RolesTypes} from '../core/constants';
import {LongTeam, ShortTeam} from './interfaces/team.interface';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {
  }

  @Post()
  async create(@Body() team: ShortTeam, @Request() req) {
    return this.teamsService.create(team, req.user);
  }

  @Post(':teamId/player')
  async addPlayer(@Param('teamId') teamId: string, @Body('player') player: string, @Request() req) {
    return this.teamsService.addPlayer(teamId, req.user, player);
  }

  @Post(':teamId/joined')
  async teamJoined(@Param('teamId') teamId: string, string, @Request() req) {
    return this.teamsService.teamJoined(teamId, req.user);
  }

  @Delete(':teamId/player')
  async removePlayer(@Param('teamId') teamId: string, @Body('player') player: string, @Request() req) {
    return this.teamsService.removePlayer(teamId, req.user, player);
  }

  @Put(':teamId')
  @Roles(RolesTypes.CREATOR)
  async update(@Param('teamId') teamId: string, @Body() createCupDto: CreateTeamDto): Promise<ShortTeam> {
    return this.teamsService.update(teamId, createCupDto);
  }

  @Delete(':teamId')
  @Roles(RolesTypes.CREATOR)
  async remove(@Param('teamId') teamId: string): Promise<void> {
    return this.teamsService.remove(teamId);
  }

  @Get()
  async findAll(): Promise<ShortTeam[]> {
    return this.teamsService.findAll();
  }

  @Get(':teamId')
  async findById(@Param('teamId') teamId: string): Promise<LongTeam> {
    return this.teamsService.findById(teamId);
  }
}