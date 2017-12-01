import { Document } from 'mongoose';
import {PrizePool} from './prize-pool.interface';
import {User} from '../../users/interfaces/user.interface';
import {TeamShort} from '../../teams/interfaces/team.interface';
import {Game} from "../../games/interfaces/game.interface";
import {CupPlayer} from "./cup-player";

interface Cup extends Document {
  readonly title: string;
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
  readonly finalbo: number;
  readonly text_update: string;
  readonly prize_pool: PrizePool;
  readonly closed: boolean;
  readonly chat: number;
  readonly grid: any;
}

export interface ShortCup extends Cup {
    readonly judges: User[];
    readonly players: CupPlayer[];
    readonly game: string;
}

export interface LongCup extends Cup {
    readonly judges: User[];
    readonly players: (User | TeamShort)[];
    readonly game: Game;
}