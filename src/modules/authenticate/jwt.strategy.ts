import * as passport from 'passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Component, Inject} from '@nestjs/common';
import {UserModelToken} from '../core/constants';
import {Model} from 'mongoose';
import {User} from '../users/interfaces/user.interface';
import {AUser} from './a-user';
import Request = Express.Request;

@Component()
export class JwtStrategy extends Strategy {
  constructor(@Inject(UserModelToken) private readonly userModel: Model<User>) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: 'ilovegg',
      },
      async (req, payload, next) => await this.verify(req, payload, next)
    );
    passport.use(this);
  }

  public async verify(req: Request, payload, done) {
    await this.userModel.findByIdAndUpdate(payload.id, payload, {upsert: true, new: true});
    let user = new AUser(payload);
    done(null, user);
  }
}