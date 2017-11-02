import {Module, NestModule, RequestMethod} from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { gamesProviders } from './games.providers';
import { DatabaseModule } from '../database/database.module';
import * as passport from 'passport';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';


const routes: any[] = [
  { path: '/games/*', method: RequestMethod.POST },
  { path: '/games/*', method: RequestMethod.PUT },
  { path: '/games/*', method: RequestMethod.DELETE },
];

@Module({
  modules: [DatabaseModule],
  controllers: [GamesController],
  components: [
    GamesService,
    ...gamesProviders,
  ],
})
export class GamesModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void {
    consumer.apply(passport.initialize()).with().forRoutes(...routes);
    consumer.apply(passport.authenticate('jwt', { session: false })).forRoutes(...routes);
  }
}