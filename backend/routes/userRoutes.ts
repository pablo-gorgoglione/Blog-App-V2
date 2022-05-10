import express from 'express';
import {
  getUsers,
  login,
  putUser,
  putUserRole,
  register,
} from '../controllers/userController';
import { isAdmin, protect } from '../middlewares/authentication';

const router = express.Router();
router
  .route('/')
  .post(register)
  .get(protect, isAdmin, getUsers)
  .put(protect, putUser);
router.route('/login').post(login);
router.route('/:id').put(protect, isAdmin, putUserRole);

export default router;
