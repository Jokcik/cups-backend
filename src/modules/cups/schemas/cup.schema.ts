import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {PrizePoolSchema} from './prize-pool.schema';
import {GameModelName, UserModelName} from '../../core/constants';
import Mixed = Schema.Types.Mixed;

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
  team_size: Number,
  title: {
    type: String,
    required: true,
  },
  finalbo: Number,
  text_update: String,
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
    // required: true
  },
  closed: {
    type: Boolean,
    default: false
  },
  judges: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: UserModelName
  },
  chat: Number,
  grid: Mixed,
  players: {
    type: [Players]
  },
  game_id: String
}, { toJSON: { virtuals: true } });

CupSchema.index('url', {unique: true});

CupSchema.virtual('game', {
  ref: GameModelName,
  localField: 'game_id',
  foreignField: 'url',
  justOne: true
});

CupSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});