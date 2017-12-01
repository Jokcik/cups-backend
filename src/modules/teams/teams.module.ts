import {Module, NestModule, RequestMethod} from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { teamsProviders } from './teams.providers';
import { DatabaseModule } from '../database/database.module';
import {GGUtils} from '../core/gg-utils';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import * as passport from "passport";
import {UsersModule} from '../users/users.module';

const routes: any[] = [
  { path: '/teams/*', method: RequestMethod.POST },
  { path: '/teams', method: RequestMethod.POST },

  { path: '/teams/*', method: RequestMethod.DELETE },
  { path: '/teams', method: RequestMethod.DELETE },

  { path: '/teams', method: RequestMethod.PUT },
  { path: '/teams/*', method: RequestMethod.PUT },
];

@Module({
  modules: [DatabaseModule, UsersModule],
  controllers: [TeamsController],
  components: [
    TeamsService,
    ...teamsProviders,
    GGUtils,
  ],
  exports: [
    TeamsService,
    ...teamsProviders,
  ]
})
export class TeamsModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void {
    consumer.apply(passport.initialize()).with().forRoutes(...routes);
    consumer.apply(passport.authenticate('jwt', { session: false })).forRoutes(...routes);
  }
}