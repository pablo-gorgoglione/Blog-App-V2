import mongoose, { Schema } from 'mongoose';
import { ILike } from '../types';

const LikeSchema = new Schema<ILike>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
});

const Like = mongoose.model<ILike>('Like', LikeSchema);

export default Like;
