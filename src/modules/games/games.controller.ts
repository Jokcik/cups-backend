import {Controller, Get, Post, Body, Put, Param, Delete, UseGuards} from '@nestjs/common';
import {CreateGameDto} from './dto/create-game.dto';
import {GamesService} from './games.service';
import {Game} from './interfaces/game.interface';
import {Schema} from 'mongoose';
import {Roles, RolesTypes} from '../core/constants';
import {GameRolesGuard} from './game-roles.guard';

@Controller('games')
@UseGuards(GameRolesGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {
  }

  @Post('update-all')
  @Roles(RolesTypes.ADMIN)
  async updateAllGame() {
    return this.gamesService.updateAllGames();
  }

  @Post()
  @Roles(RolesTypes.ADMIN)
  async create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Put(':id')
  @Roles(RolesTypes.ADMIN)
  async update(@Param('id') id: Schema.Types.ObjectId, @Body() createGameDto: CreateGameDto) {
    return this.gamesService.update(id, createGameDto);
  }

  @Delete(':id')
  @Roles(RolesTypes.ADMIN)
  async remove(@Param('id') id: Schema.Types.ObjectId): Promise<void> {
    return this.gamesService.remove(id);
  }

  @Get()
  async findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: Schema.Types.ObjectId): Promise<Game> {
    return this.gamesService.findById(id);
  }
}