import express from 'express';
import {
  deleteLikeOnPost,
  postLikeOnPost,
} from '../controllers/likeController';
import {
  deletePost,
  getPost,
  getPosts,
  postPost,
  putPost,
} from '../controllers/postController';
import { isAdmin, protect } from '../middlewares/authentication';
import commentRotes from './commentRoutes';

const router = express.Router();
router
  .route('/:id')
  .put(protect, isAdmin, putPost)
  .get(getPost)
  .delete(protect, isAdmin, deletePost);
router.use('/:id/comments/', commentRotes);
router
  .route('/:id/like')
  .post(protect, postLikeOnPost)
  .delete(protect, deleteLikeOnPost);
router.route('/').get(getPosts).post(protect, isAdmin, postPost);

export default router;
