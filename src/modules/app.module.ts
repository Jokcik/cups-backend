import {Module} from '@nestjs/common';
import {CupsModule} from './cups/cups.module';
import {GamesModule} from './games/games.module';
import {TeamsModule} from './teams/teams.module';
import {UsersModule} from './users/users.module';
import {AuthModule} from './authenticate/auth.module';
import {UploadsModule} from './uploads/uploads.module';

@Module({
  modules: [
    CupsModule,
    GamesModule,
    TeamsModule,
    UsersModule,
    AuthModule,
    UploadsModule
  ],
})
export class ApplicationModule {
}