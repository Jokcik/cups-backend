import { Document } from 'mongoose';
import {UserRelationLong, UserRelationShort} from './user-relation.interface';

export interface Team extends Document{
  readonly title: string;
  readonly url: string;
  readonly ei_creator: string;
  readonly status: number;
  readonly logo: string;
  readonly chat: number;
}

export interface TeamLong extends Team {
  readonly players: UserRelationLong[];
}

export interface TeamShort extends Team {
  readonly players: UserRelationShort[];
}
