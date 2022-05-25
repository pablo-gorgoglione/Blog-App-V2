import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 4,
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
