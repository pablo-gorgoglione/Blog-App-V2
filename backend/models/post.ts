import mongoose, { Schema } from 'mongoose';
import { postComment } from '../controllers/commentController';
import { IPost } from '../types';

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    isPublished: {
      type: Boolean,
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

PostSchema.virtual('commentCounter').get(function () {
  if (!this.comments) {
    return 0;
  }
  return this.comments.length;
});
PostSchema.virtual('likeCounter').get(function () {
  if (!this.likes) {
    return 0;
  }
  return this.likes.length;
});

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;
