import * as mongoose from 'mongoose';

export const PrizePoolSchema = new mongoose.Schema({
  places: Number,
  amount: Number,
  currency: String,
  items: Array,
  site_rate: {
    type: Number,
    default: 10
  },
  creator_rate: {
    type: Number,
    default: 10
  }
}, {_id: false});