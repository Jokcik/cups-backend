import { Document } from 'mongoose';

export interface Game extends Document {
  readonly title: string;
  readonly url: string;
  readonly team_size: number;
  readonly maps: string;
}