import * as mongoose from 'mongoose';
import {UserRelationSchema} from './user-relation.schema';

export const TeamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  ei_creator: String,
  status: {
    type: Number,
    default: 0
  },
  players: {
    type: Number,
    default: 0
  },
  logo: {
    type: String
  },
  chat: {
    type: Number,
    required: true
  },
  type: {
    type: Boolean,
    default: true
  },
  users: [UserRelationSchema]
});

TeamSchema.index('url', {unique: true});


TeamSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});