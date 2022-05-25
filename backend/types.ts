import { Types, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface IPost extends Document {
  author: string;
  title: string;
  content: string;
  tags: Array<string>;
  isPublished: boolean;
  likes: Array<ILike>;
  comments: Array<IComment>;
  // commentCounter?: number;
}

export interface IComment extends Document {
  user: string;
  post: string;
  content: string;
  likes: Array<ILike>;
}

export interface ILike extends Document {
  user: string;
  post: string;
  comment: string;
}
