import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {Component, Inject} from '@nestjs/common';
import {UserModelToken} from '../constants';
import {Model} from 'mongoose';
import {User} from '../users/interfaces/user.interface';
import {UserService} from './user.service';
import Request = Express.Request;

@Component()
export class JwtStrategy extends Strategy {
  constructor(@Inject(UserModelToken) private readonly userModel: Model<User>,
              private userService: UserService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: 'ilovegg',
      },
      async (req, payload, next) => await this.verify(req, payload, next)
    );
    passport.use(this);
    // passport.serializeUser((user: any, done) => {
    //   done(null, user.id);
    // });
  }

  public async verify(req: Request, payload, done) {
    await this.userModel.findByIdAndUpdate(payload.id, payload, {upsert: true, new: true});
    done(null, payload);
  }
}