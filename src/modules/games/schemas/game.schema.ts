import * as mongoose from 'mongoose';

export const GameSchema = new mongoose.Schema({
  title: String,
  url: {
    type: String,
    required: true
  },
  team_size: {
    type: Number,
    default: 1
  },
  maps: String
});

GameSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});

GameSchema.index('url', {unique: true});