import {Controller, Get, Post, Body, Param} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UsersService} from './users.service';
import {User} from './interfaces/user.interface';
import {Schema} from 'mongoose';
import {Team} from '../teams/interfaces/team.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: Schema.Types.ObjectId): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get(':id/teams')
  async findTeams(@Param('id') id: Schema.Types.ObjectId): Promise<Team[]> {
    return this.usersService.findTeams(id);
  }
}
