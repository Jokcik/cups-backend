import {Module, NestModule, RequestMethod} from '@nestjs/common';
import { CupsController } from './cups.controller';
import { CupsService } from './cups.service';
import { cupsProviders } from './cups.providers';
import { DatabaseModule } from '../database/database.module';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import * as passport from 'passport';
import {AuthModule} from '../authenticate/auth.module';
import {TeamsModule} from '../teams/teams.module';

const routes: any[] = [
  { path: '/cups/*', method: RequestMethod.POST },
  { path: '/cups', method: RequestMethod.POST },

  { path: '/cups/*', method: RequestMethod.DELETE },
  { path: '/cups', method: RequestMethod.DELETE },

  { path: '/cups', method: RequestMethod.PUT },
  { path: '/cups/*', method: RequestMethod.PUT },
];

@Module({
  modules: [DatabaseModule, AuthModule, TeamsModule],
  controllers: [CupsController],
  components: [
    CupsService,
    ...cupsProviders,
  ],
})
export class CupsModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void {
    consumer.apply(passport.initialize()).with().forRoutes(...routes);
    consumer.apply(passport.authenticate('jwt', { session: false })).forRoutes(...routes);
  }
}