import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { DatabaseModule } from '../database/database.module';
import {teamsProviders} from '../teams/teams.providers';
import {TeamsService} from '../teams/teams.service';

@Module({
  modules: [DatabaseModule],
  controllers: [UsersController],
  components: [
    UsersService,
    ...usersProviders,
  ],
  exports: [
    UsersService,
    ...usersProviders,
  ]
})
export class UsersModule {}