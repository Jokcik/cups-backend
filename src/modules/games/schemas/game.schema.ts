import * as mongoose from 'mongoose';

export const GameSchema = new mongoose.Schema({
  title: String,
  url: String,
  team_size: {
    type: Number,
    default: 1
  },
  maps: String
});