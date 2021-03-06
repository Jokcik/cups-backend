import {PrizePool} from '../interfaces/prize-pool.interface';
import {Game} from '../../games/interfaces/game.interface';

export class CreateCupDto {
  readonly title: string;
  readonly description: string;
  readonly type: number;
  readonly url: string;
  readonly start: string;
  readonly status: number;
  readonly logo: string;
  readonly ei_creator: string;
  readonly ei_created: number;
  readonly deleted: boolean;
  readonly text_update: string;
  readonly hidden: boolean;
  readonly invites: boolean;
  readonly prize_pool: PrizePool;
  readonly closed: boolean;
  readonly finalbo: number;
  readonly chat: number;
  readonly grid: any;
  readonly players: {id: string, lineup: string[]};
  readonly judges: string[];
  readonly game: number;
}