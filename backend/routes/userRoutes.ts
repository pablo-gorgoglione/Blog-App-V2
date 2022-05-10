import express from 'express';
import { getUsers, login, register } from '../controllers/userController';
import { isAdmin, protect } from '../middlewares/authentication';

const router = express.Router();
router.route('/').post(register).get(protect, isAdmin, getUsers);
router.route('/login').post(login);

export default router;
