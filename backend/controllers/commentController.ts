import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import Comment from '../models/comment';
import mongoose, { ClientSession } from 'mongoose';
import Post from '../models/post';
import User from '../models/user';
import { searchUser } from './userController';
import { searchPost } from './postController';
import { IComment } from '../types';

// @route POST /api/post/:id/comment/
// @acess Private
export const postComment = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;
  const postId = req.params.id;

  const user = await searchUser(req);
  const post = await searchPost(postId);

  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    //Updates the commentCounter on post
    post.commentCounter = post.commentCounter + 1;
    await post.save({ session });

    //Create the comment
    const comment = await Comment.create(
      [
        {
          user: user.id,
          post: postId,
          content,
        },
      ],
      { session }
    );

    //Commit transaction
    await session.commitTransaction();
    await session.endSession();

    // the Comment.create returns an array<Comment> and so the comment[0]
    res.status(201).json(comment[0]);
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Error creating the comment');
  }
});

// @route DELETE /api/post/:id/comment/:commentId
// @acess Private
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await searchUser(req);
    const comment = await searchComment(req.params.commentId);
    const post = await searchPost(req.params.id);

    if (comment.user.toString() !== user.id) {
      throw new Error('Only the author of the comment can delete it.');
    }

    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      await comment.delete(session);
      post.commentCounter = post.commentCounter - 1;
      await post.save({ session });
      await session.commitTransaction();
      await session.endSession();
      res.json({ message: 'Comment deleted' });
      return;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      console.log(error);
      throw new Error('Error deleting the comment');
    }
  }
);

// @route GET /api/post/:id/comment/
// @acess Private
export const getCommentsForPost = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    if (!postId) {
      throw new Error('Missing or invalid post id');
    }
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Missing or invalid post id');
    }
    const comments = await Comment.find({ post: postId })
      .sort({ date: 'desc' })
      .populate({
        path: 'User',
        select: 'username _id',
      });
    res.json(comments);
    return;
  }
);

// @desc  Return a Comment or throws an error for invalid id
export const searchComment = async (id: string): Promise<IComment> => {
  if (!id) {
    throw new Error('Missing comment id');
  }
  const comment: IComment | null = await Comment.findById(id);
  if (!comment) {
    throw new Error('Comment not found, invalid comment id');
  }
  return comment;
};
