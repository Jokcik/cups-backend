import { Connection } from 'mongoose';
import { CupSchema } from './schemas/cup.schema';
import {CupModelName, CupModelToken, DbConnectionToken} from '../constants';

export const cupsProviders = [
  {
    provide: CupModelToken,
    useFactory: (connection: Connection) => connection.model(CupModelName, CupSchema),
    inject: [DbConnectionToken],
  },
];