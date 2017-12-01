import {Controller, Get, Param, Query} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from './interfaces/user.interface';
import {Schema} from 'mongoose';
import {TeamShort} from "../teams/interfaces/team.interface";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  // @Post()
  // @Roles(RolesTypes.ADMIN)
  // async create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('players')
  async findPlayers(@Query('q') search: string, @Query('limit') limit: number): Promise<any> {
    return this.usersService.findPlayers(search ? search : '', +limit ? +limit : 10);
  }

  @Get(':id')
  async findOne(@Param('id') id: Schema.Types.ObjectId): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get(':id/teams')
  async findTeams(@Param('id') id: Schema.Types.ObjectId): Promise<TeamShort[]> {
    return this.usersService.findTeams(id);
  }
}
