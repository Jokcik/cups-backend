import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {UserModelName} from '../../core/constants';

export const UserRelationSchema = new mongoose.Schema({
  joined: {
    type: Number,
    default: 0
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: UserModelName,
  }
}, {_id: false});