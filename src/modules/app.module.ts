import {Module} from '@nestjs/common';
import {CupsModule} from './cups/cups.module';
import {GamesModule} from './games/games.module';
import {TeamsModule} from './teams/teams.module';
import {UsersModule} from './users/users.module';
import {AuthModule} from './authenticate/auth.module';

@Module({
  modules: [
    CupsModule,
    GamesModule,
    TeamsModule,
    UsersModule,
    AuthModule
  ],
})
export class ApplicationModule {
}