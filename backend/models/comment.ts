import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types';

const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    content: {
      type: String,
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
CommentSchema.virtual('likeCounter').get(function () {
  if (!this.likes) {
    return 0;
  }
  return this.likes.length;
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
