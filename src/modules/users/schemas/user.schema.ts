import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true
  },
  logo: String
});

UserSchema.index('nickname', {unique: true});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});