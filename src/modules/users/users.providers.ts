import { Connection } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import {DbConnectionToken, UserModelName, UserModelToken} from '../constants';

export const usersProviders = [
  {
    provide: UserModelToken,
    useFactory: (connection: Connection) => connection.model(UserModelName, UserSchema),
    inject: [DbConnectionToken],
  },
];