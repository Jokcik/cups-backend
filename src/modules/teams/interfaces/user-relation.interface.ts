import { Document } from 'mongoose';

export interface UserRelation extends Document {
  readonly joined: number;
  readonly user: string;
}