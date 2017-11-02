import { Connection } from 'mongoose';
import { GameSchema } from './schemas/game.schema';
import {DbConnectionToken, GameModelName, GameModelToken} from '../constants';

export const gamesProviders = [
  {
    provide: GameModelToken,
    useFactory: (connection: Connection) => connection.model(GameModelName, GameSchema),
    inject: [DbConnectionToken],
  },
];