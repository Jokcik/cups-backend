///<reference path="../../../../node_modules/@types/mongoose/index.d.ts"/>
import * as mongoose from 'mongoose';
import {PrizePoolSchema} from './prize-pool.schema';
import {Schema} from 'mongoose';
import Mixed = Schema.Types.Mixed;
import {GameModelName, UserModelName} from '../../constants';

const Players = new mongoose.Schema({
  id: Schema.Types.ObjectId,
  lineup: {
    type: [Schema.Types.ObjectId],
    default: undefined
  },
  checkIn: {
    type: Boolean,
    default: false
  }
}, {_id: false});

export const CupSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,

  },
  type: Number,
  url: {
    type: String,
    required: true,
    unique: true
  },
  start: {
    type: Date,
    required: true
  },
  logo: String,
  ei_creator: {
    type: String,
    required: true
  },
  ei_created: {
    type: Date,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  invites: {
    type: Boolean,
    default: false
  },
  prize_pool: {
    type: PrizePoolSchema,
    required: true
  },
  closed: {
    type: Boolean,
    default: false
  },
  judges: {
    type: [UserModelName],
    default: []
  },
  chat: Number,
  grid: Mixed,
  players: {
    type: [Players]
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: GameModelName
  }
});
