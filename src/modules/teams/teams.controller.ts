import {Controller, Get, Post, Body, Param, Request, Put, Delete} from '@nestjs/common';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamsService} from './teams.service';
import {Schema} from 'mongoose';
import {Roles, RolesTypes} from '../core/constants';
import ObjectId = Schema.Types.ObjectId;
import {LongTeam, ShortTeam} from './interfaces/team.interface';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamsService.create(createTeamDto, req.user);
  }

  @Post(':id/user')
  async addUser(@Param('id') id: ObjectId, @Body('user') user: string, @Request() req) {
    return this.teamsService.addUser(id, req.user, user);
  }

  @Post(':id/joined')
  async teamJoined(@Param('id') id: ObjectId, string, @Request() req) {
    return this.teamsService.teamJoined(id, req.user);
  }

  @Delete(':id/user')
  async removeUser(@Param('id') id: ObjectId, @Body('user') user: string, @Request() req) {
    return this.teamsService.removeUser(id, req.user, user);
  }

  @Put(':id')
  @Roles(RolesTypes.CREATOR)
  async update(@Param('id') id: Schema.Types.ObjectId, @Body() createCupDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.update(id, createCupDto);
  }

  @Delete(':id')
  @Roles(RolesTypes.CREATOR)
  async remove(@Param('id') id: Schema.Types.ObjectId): Promise<void> {
    return this.teamsService.remove(id);
  }

  @Get()
  async findAll(): Promise<ShortTeam[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: Schema.Types.ObjectId): Promise<LongTeam> {
    return this.teamsService.findById(id);
  }
}