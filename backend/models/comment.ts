import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types';

const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  content: {
    type: String,
    required: true,
  },
  likeCounter: { type: Number, default: 0 },
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
