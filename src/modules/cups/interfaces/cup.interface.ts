import { Document } from 'mongoose';
import {PrizePool} from './prize-pool.interface';
import {Game} from '../../games/interfaces/game.interface';
import {User} from '../../users/interfaces/user.interface';
import {Team} from '../../teams/interfaces/team.interface';

export interface Cup extends Document {
  readonly description: string;
  readonly type: number;
  readonly url: string;
  readonly start: Date;
  readonly logo: string;
  readonly ei_creator: string;
  readonly ei_created: Date;
  readonly deleted: boolean;
  readonly hidden: boolean;
  readonly invites: boolean;
  readonly prize_pool: PrizePool;
  readonly closed: boolean;
  readonly chat: number;
  readonly grid: any;
  readonly players: (User | Team)[];
  readonly judges: User[];
  readonly game: number;
}