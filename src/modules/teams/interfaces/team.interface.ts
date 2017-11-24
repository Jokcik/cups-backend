import { Document } from 'mongoose';
import {UserRelation} from './user-relation.interface';

interface Team extends Document {
  readonly title: string;
  readonly url: string;
  readonly ei_creator: string;
  readonly status: number;
  readonly players: number;
  readonly logo: string;
  readonly chat: number;
}

export interface ShortTeam extends Team {
  readonly users: UserRelation[];
}

export interface LongTeam extends Team {
  readonly users: string[];
}