import express from 'express';
import {
  deleteComment,
  getCommentsForPost,
  postComment,
} from '../controllers/commentController';
import {
  deleteLikeOnComment,
  postLikeOnComment,
} from '../controllers/likeController';
import { protect } from '../middlewares/authentication';

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, postComment).get(getCommentsForPost);
router
  .route('/:commentId/like')
  .post(protect, postLikeOnComment)
  .delete(protect, deleteLikeOnComment);
router.route('/:commentId').delete(protect, deleteComment);

export default router;
