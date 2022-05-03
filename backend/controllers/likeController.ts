import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import mongoose from 'mongoose';
import Post from '../models/post';
import Like from '../models/like';
import User from '../models/user';
import Comment from '../models/comment';

// @route POST /api/post/:id/like
// @acess Private
export const postLikeOnPost = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const userId = req.user ? req.user.id : '';
    if (!userId) {
      throw new Error('Missing or invalid token');
    }

    const like = await Like.findOne({ user: userId, post: postId });
    if (like) {
      throw new Error('Only one like per User');
    }

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      // Update post - likeCounter +1
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Missing or invalid post id');
      }
      post.likeCounter = post.likeCounter + 1;
      await post.save({ session });

      // Update user - likePosts +1 - push postId
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Missing or invalid user id');
      }
      user.likedPosts = [...user.likedPosts, postId];

      // Create like
      const like = await Like.create([{ user: userId, post: postId }], {
        session,
      });

      await session.commitTransaction();
      await session.endSession();
      res.status(201).json(like);
      return;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error('Error liking the post');
    }
  }
);

// @route DELETE /api/post/:id/like
// @acess Private
export const deleteLikeOnPost = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const userId = req.user ? req.user.id : '';
    if (!userId) {
      throw new Error('Missing or invalid token');
    }

    const like = await Like.findOne({ user: userId, post: postId });
    if (!like) {
      throw new Error('Like do not exists');
    }

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      // Update post - likeCounter -1
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Missing or invalid post id');
      }
      post.likeCounter = post.likeCounter - 1;
      await post.save({ session });

      // Update user - likePosts -1 - filter postId
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Missing or invalid user id');
      }
      user.likedPosts = [...user.likedPosts, postId];
      user.likedPosts = user.likedPosts.filter((lp) => lp !== postId);

      // Delete like
      like.delete(session);

      await session.commitTransaction();
      await session.endSession();
      res.status(200).json({ message: 'Like deleted' });
      return;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error('Error liking the post');
    }
  }
);

// @route POST /api/post/:id/comment/:commentId/like
// @acess Private
export const postLikeOnComment = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user ? req.user.id : '';

    if (!userId) {
      throw new Error('Missing or invalid token');
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Missing or invalid post id');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error('Missing or invalid comment id');
    }

    const like = await Like.findOne({ user: userId, post: postId });
    if (like) {
      throw new Error('Only one like per User');
    }

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      // Update Comment - likeCounter +1

      comment.likeCounter = comment.likeCounter + 1;
      await comment.save({ session });

      // Update user - likePosts +1 - push postId
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Missing or invalid user id');
      }
      user.likedComments = [...user.likedComments, postId];

      // Create like
      const like = await Like.create(
        [{ user: userId, post: postId, comment: commentId }],
        {
          session,
        }
      );

      await session.commitTransaction();
      await session.endSession();
      res.status(201).json(like);
      return;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error('Error liking the comment');
    }
  }
);

// @route DELETE /api/post/:id/comment/:commentId/like
// @acess Private
export const deleteLikeOnComment = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user ? req.user.id : '';

    if (!userId) {
      throw new Error('Missing or invalid token');
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Missing or invalid user id');
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Missing or invalid post id');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error('Missing or invalid comment id');
    }

    const like = await Like.findOne({
      user: userId,
      post: postId,
      comment: commentId,
    });
    if (!like) {
      throw new Error('Like do not exists');
    }

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      // Update post - likeCounter -1
      comment.likeCounter = comment.likeCounter - 1;
      await comment.save({ session });

      // Update user - likePosts -1 - filter postId
      user.likedComments = [...user.likedComments, commentId];
      user.likedComments = user.likedComments.filter((lc) => lc !== commentId);

      // Delete like
      like.delete(session);

      await session.commitTransaction();
      await session.endSession();
      res.status(200).json({ message: 'Like deleted' });
      return;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error('Error liking the post');
    }
  }
);
