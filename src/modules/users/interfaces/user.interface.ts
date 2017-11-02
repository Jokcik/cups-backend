import { Document } from 'mongoose';

export interface User extends Document {
  readonly id: string;
  readonly nickname: string;
  readonly logo: string;
  readonly type: string;
}