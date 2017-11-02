import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true
  },
  logo: String
});