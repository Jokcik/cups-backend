import { Document } from 'mongoose';
import {UserRelation} from './user-relation.interface';

export interface Team extends Document {
  readonly title: string;
  readonly url: string;
  readonly ei_creator: string;
  readonly status: number;
  readonly players: string;
  readonly logo: string;
  readonly chat: number;
  readonly users: UserRelation[];
}