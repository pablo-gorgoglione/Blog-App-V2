import { Types, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  isAdmin: boolean;
  likedPosts: Array<string>;
  likedComments: Array<string>;
}

export interface IPost extends Document {
  author: string;
  title: string;
  content: string;
  tags: Array<string>;
  isPublished: boolean;
  likeCounter: number;
  commentCounter: number;
}

export interface IComment extends Document {
  user: string;
  post: string;
  content: string;
  likeCounter: number;
}

export interface ILike extends Document {
  user: string;
  post: string;
  comment: string;
}
