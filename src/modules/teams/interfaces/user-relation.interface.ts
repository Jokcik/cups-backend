import { Document } from 'mongoose';
import {User} from "../../users/interfaces/user.interface";

interface UserRelation {
  readonly joined: number;
}

export interface UserRelationLong extends UserRelation, User{
}

export interface UserRelationShort extends UserRelation, Document {
  readonly player: string;
}