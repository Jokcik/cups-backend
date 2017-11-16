import { Connection } from 'mongoose';
import { TeamSchema } from './schemas/team.schema';
import {DbConnectionToken, TeamModelName, TeamModelToken} from '../core/constants';

export const teamsProviders = [
  {
    provide: TeamModelToken,
    useFactory: (connection: Connection) => connection.model(TeamModelName, TeamSchema),
    inject: [DbConnectionToken],
  },
];