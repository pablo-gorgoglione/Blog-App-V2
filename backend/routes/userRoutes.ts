import express from 'express';
import { login, register } from '../controllers/userController';
import { protect } from '../middlewares/authentication';

const router = express.Router();
router.route('/').post(register);
router.route('/login').post(login);

export default router;
