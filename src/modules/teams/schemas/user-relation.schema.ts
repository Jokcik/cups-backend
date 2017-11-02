import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {UserModelName} from '../../constants';

export const UserRelationSchema = new mongoose.Schema({
  joiden: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModelName,
  }
}, {_id: false});