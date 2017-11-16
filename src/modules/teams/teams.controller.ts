import {Controller, Get, Post, Body, Param, Request, Put, Delete} from '@nestjs/common';
import {CreateTeamDto} from './dto/create-team.dto';
import {TeamsService} from './teams.service';
import {Team} from './interfaces/team.interface';
import {Schema} from 'mongoose';
import {Roles, RolesTypes} from '../core/constants';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamsService.create(createTeamDto, req.user);
  }

  @Put(':id')
  @Roles(RolesTypes.CREATOR, RolesTypes.ADMIN)
  async update(@Param('id') id: Schema.Types.ObjectId, @Body() createCupDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.update(id, createCupDto);
  }

  @Delete(':id')
  @Roles(RolesTypes.CREATOR, RolesTypes.ADMIN)
  async remove(@Param('id') id: Schema.Types.ObjectId): Promise<void> {
    return this.teamsService.remove(id);
  }

  @Get()
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: Schema.Types.ObjectId): Promise<Team> {
    return this.teamsService.findById(id);
  }
}