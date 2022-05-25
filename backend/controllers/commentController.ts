import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import Comment from '../models/comment';
import mongoose from 'mongoose';
import { searchUser } from './userController';
import { searchPost } from './postController';
import { IComment } from '../types';

// @route POST /api/post/:id/comment/
// @acess Private
export const postComment = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;

  const user = await searchUser(req);
  const post = await searchPost(req.params.id);

  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    //Create the comment
    const [comment] = await Comment.create(
      [
        {
          user: user.id,
          post: post._id,
          content,
        },
      ],
      { session }
    );
    post.comments.push(comment._id);
    await post.save({ session });

    //Commit transaction
    await session.commitTransaction();
    await session.endSession();
    await comment.populate({ path: 'user', select: 'username' });
    // the Comment.create returns an array<Comment> and so the comment[0]
    res.status(201).json(comment.toJSON());
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

    // validate if the user that is trying to delete is the author of the comment
    if (comment.user.toString() !== user.id) {
      throw new Error('Only the author of the comment can delete it.');
    }

    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      post.comments = post.comments.filter((c) => {
        c.id !== comment.id;
      });
      await comment.delete(session);
      await post.save({ session });
      await session.commitTransaction();
      await session.endSession();
      res.json(post);
      return;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      console.log(error);
      throw new Error('Error deleting the comment');
    }
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

// @desc Return if exists the comments for one post, postId(searchPost) must be validated before
export const getCommentsForPost = async (postId: string) => {
  const comments: IComment[] | null = await Comment.find({ post: postId })
    .sort({ date: 'desc' })
    .populate({
      path: 'user',
      select: 'username _id',
    });
  return comments;
};
