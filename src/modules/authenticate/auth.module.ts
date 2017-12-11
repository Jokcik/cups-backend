import {Module,} from '@nestjs/common';
import {JwtStrategy} from './jwt.strategy';
import {usersProviders} from '../users/users.providers';
import {DatabaseModule} from '../database/database.module';
import {UserService} from './user.service';

@Module({
  modules: [DatabaseModule],
  components: [JwtStrategy, ...usersProviders, UserService],
  exports: [UserService]
})
export class AuthModule {
}
