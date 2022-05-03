import mongoose, { Schema } from 'mongoose';
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
    likeCounter: { type: Number, default: 0 },
    commentCounter: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;
