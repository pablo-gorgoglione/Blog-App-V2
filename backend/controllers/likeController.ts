import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import mongoose from 'mongoose';
import Like from '../models/like';
import { searchUser } from './userController';
import { searchPost } from './postController';
import { searchComment } from './commentController';

// @route POST /api/post/:id/like
// @acess Private
export const postLikeOnPost = asyncHandler(
  async (req: Request, res: Response) => {
    /* BEGIN - PromiseAll */
    const post = await searchPost(req.params.id);
    const user = await searchUser(req);
    const like = await Like.findOne({ user: user._id, post: post._id });
    if (like) {
      throw new Error('Only one like per User');
    }
    /* END   - PromiseAll */

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      // Create like

      /* BEGIN - PromiseAll */
      await user.save({ session });
      const like = await Like.create([{ user: user._id, post: post._id }], {
        session,
      });
      post.likes.push(like[0]._id);
      await post.save({ session });
      /* END   - PromiseAll */

      await session.commitTransaction();
      await session.endSession();
      await post.populate({ path: 'likes', select: 'user' });

      res.status(201).json(post);
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
    /* PromiseAll */
    const post = await searchPost(req.params.id);
    const user = await searchUser(req);
    const like = await Like.findOne({ user: user._id, post: post._id });
    if (!like) {
      throw new Error('Like do not exists');
    }
    /* PromiseAll */

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      post.likes = post.likes.filter((l) => {
        l.id !== like.id;
      });
      // post.likeCounter = post.likeCounter - 1;

      /* PromiseAll */
      await post.save({ session });
      await user.save({ session });
      await like.delete(session);
      /* PromiseAll */

      await session.commitTransaction();
      await session.endSession();
      await post.populate({ path: 'likes', select: 'user' });

      res.status(200).json(post);
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
    /* PromiseAll */
    const user = await searchUser(req);
    const post = await searchPost(req.params.id);
    const comment = await searchComment(req.params.commentId);

    const like = await Like.findOne({
      user: user._id,
      post: post._id,
      comment: comment._id,
    });
    /* PromiseAll */
    if (like) {
      throw new Error('Only one like per User ');
    }

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      /* PromiseAll */
      const like = await Like.create(
        [{ user: user._id, post: post._id, comment: comment._id }],
        {
          session,
        }
      );
      comment.likes.push(like[0]._id);
      await comment.save({ session });
      await user.save({ session });
      /* PromiseAll */

      await session.commitTransaction();
      await session.endSession();
      res.status(201).json({ message: 'Like created succesfully', comment });
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
    /* PromiseAll */
    const user = await searchUser(req);
    const post = await searchPost(req.params.id);
    const comment = await searchComment(req.params.commentId);
    const like = await Like.findOne({
      user: user._id,
      post: post._id,
      comment: comment._id,
    });
    /* PromiseAll */
    if (!like) {
      throw new Error('Like do not exists');
    }

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      // Update post - likeCounter -1
      comment.likes = comment.likes.filter((l) => {
        l.id !== like.id;
      });
      // Update user - likePosts -1 - filter postId

      /* PromiseAll */
      await comment.save({ session });
      await user.save({ session });
      await like.delete(session);
      /* PromiseAll */

      await session.commitTransaction();
      await session.endSession();
      res.json(post);
      return;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error('Error liking the post');
    }
  }
);
