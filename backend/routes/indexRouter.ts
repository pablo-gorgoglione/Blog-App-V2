import { Router } from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
const router = Router();

// URL/api
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;
