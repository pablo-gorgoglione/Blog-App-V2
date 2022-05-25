import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import Post from '../models/post';
import { IPost } from '../types';
import { paginatePosts } from '../utils/pagination';
import { getCommentsForPost } from './commentController';
import mongoose from 'mongoose';
import Like from '../models/like';
import Comment from '../models/comment';

// @route GET /api/posts/
// @acess Public
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await paginatePosts(Post, req);

  res.json(posts);
});

// @route GET /api/posts/notpublished
// @acess Private
export const getPostsNP = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find({ isPublished: false }).sort({
    createdAt: 'desc',
  });
  res.json(posts);
});

// @route POST /api/posts/
// @acess Private
export const postPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, tags, isPublished } = req.body;

  if (!title) {
    throw new Error('A title is requiered.');
  }
  if (!tags) {
    throw new Error('At least one tag is requiered.');
  }
  if (!content) {
    throw new Error('A content is requiered.');
  }
  const post = await Post.create({
    author: req.user?.id,
    title,
    content,
    tags,
    isPublished,
  });

  res.status(201).json(post);
});

// @route DELETE /api/posts/:id
// @acess Private
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await searchPost(req.params.id);

  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    await Like.deleteMany({ post: post._id }).session(session);
    await Comment.deleteMany({ post: post._id }).session(session);
    await post.delete(session);
    await session.commitTransaction();
    await session.endSession();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Error deleting the post');
  }
});

// @route PUT /api/posts/:id
// @acess Private
export const putPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, tags, isPublished } = req.body;
  const post = await searchPost(req.params.id);
  post.title = title ? title : post.title;
  post.content = content ? content : post.content;
  post.tags = tags ? tags : post.tags;
  post.isPublished =
    typeof isPublished === 'undefined' ? post.isPublished : isPublished;
  await post.save();
  res.json(post);
});

// @route GET /api/posts/:id
// @acess Public
export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await searchPost(req.params.id, [
    'updatedAt',
    'isPublished',
    'author',
    '__v',
  ]);

  await Promise.all([
    post.populate([
      { path: 'likes', select: 'user' },
      {
        path: 'comments',
        select: 'content user likeCounter likes',
      },
    ]),
  ]);
  await post.populate([
    {
      path: 'comments.user',
      select: 'username',
    },
    { path: 'comments.likes' },
  ]);
  res.json(post);
  return;
});

// @desc  Return a Post or throws an error for invalid id
export const searchPost = async (
  id: string,
  omit?: string[]
): Promise<IPost> => {
  if (!id) {
    throw new Error('Missing post id');
  }

  let omitString = '';
  if (omit && omit?.length > 0) {
    omit.forEach((e) => {
      omitString = omitString + `-${e} `;
    });
  }

  let post: IPost | null;
  if (omitString == '') {
    post = await Post.findById(id);
  } else {
    post = await Post.findById(id).select(omitString);
  }

  if (!post) {
    throw new Error('Post not found, invalid post id');
  }
  return post;
};
