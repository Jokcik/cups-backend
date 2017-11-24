import { Document } from 'mongoose';
import {UserRelation} from './user-relation.interface';

interface Team extends Document {
  readonly title: string;
  readonly url: string;
  readonly ei_creator: string;
  readonly status: number;
  readonly logo: string;
  readonly chat: number;
}

export interface ShortTeam extends Team {
  readonly players: UserRelation[];
}

export interface LongTeam extends Team {
  readonly players: string[];
}