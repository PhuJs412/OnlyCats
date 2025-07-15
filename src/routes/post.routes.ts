import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { authenticateJWT } from '../middleware/authenJWT.middleware';

const router = Router();

router.get('/', postController.getAllPost);
router.get('/user-posts/:userId', authenticateJWT, postController.getPostsByUserId);
router.get('/:id', authenticateJWT, postController.getPostById);
router.get('/count-shared-post/:id', postController.countTotalSharedPostById);

router.post('/create/', authenticateJWT, postController.createPost);
router.post('/create-shared-post/', authenticateJWT, postController.createSharedPost);

router.patch('/edit/:id', authenticateJWT, postController.updatePost);

router.delete('/delete/:id', authenticateJWT, postController.deletePost);

export default router;