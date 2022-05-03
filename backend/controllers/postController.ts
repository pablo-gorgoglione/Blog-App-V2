import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import Post from '../models/post';
import { IPost } from '../types';
import { paginatePosts } from '../utils/pagination';

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
  await post.delete();
  res.status(200).json({ message: 'Post deleted successfully' });
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
  const post = await searchPost(req.params.id);
  res.json(post);
  return;
});

// @desc  Return a Post or throws an error for invalid id
export const searchPost = async (id: string): Promise<IPost> => {
  if (!id) {
    throw new Error('Missing post id');
  }
  const post: IPost | null = await Post.findById(id);
  if (!post) {
    throw new Error('Post not found, invalid post id');
  }
  return post;
};
