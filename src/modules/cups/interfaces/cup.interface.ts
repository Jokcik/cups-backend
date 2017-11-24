import { Document } from 'mongoose';
import {PrizePool} from './prize-pool.interface';
import {User} from '../../users/interfaces/user.interface';
import {ShortTeam} from '../../teams/interfaces/team.interface';
import {Game} from '../../games/interfaces/game.interface';
import {CupPlayer} from './cup-player';

interface Cup extends Document {
  readonly description: string;
  readonly type: number;
  readonly team_size: number;
  readonly finalbo: number;
  readonly title: string;
  readonly text_update: string;
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
}

export interface LongCup extends Cup {
  readonly players: (User | ShortTeam)[];
  readonly game: Game;
  readonly judges: User[];
}

export interface ShortCup extends Cup {
  readonly players: CupPlayer[];
  readonly game_id: string;
  readonly judges: string[];
}