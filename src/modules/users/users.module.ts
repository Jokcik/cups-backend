import {Module, NestModule, RequestMethod} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {usersProviders} from './users.providers';
import {DatabaseModule} from '../database/database.module';
import {MiddlewaresConsumer} from "@nestjs/common/interfaces/middlewares";
import * as passport from "passport";

const routes: any[] = [
  { path: '/users/teams', method: RequestMethod.GET },
];

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
export class UsersModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void {
    consumer.apply(passport.initialize()).with().forRoutes(...routes);
    consumer.apply(passport.authenticate('jwt', { session: false })).forRoutes(...routes);
  }
}