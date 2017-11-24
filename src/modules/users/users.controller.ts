import {Controller, Get, Param} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from './interfaces/user.interface';
import {ShortTeam} from '../teams/interfaces/team.interface';

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

  @Get(':nickname')
  async findOne(@Param('nickname') nickname: string): Promise<User> {
    return this.usersService.findById(nickname);
  }

  @Get(':nickname/teams')
  async findTeams(@Param('nickname') nickname: string): Promise<ShortTeam[]> {
    return this.usersService.findTeams(nickname);
  }
}
