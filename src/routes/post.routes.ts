import { Router } from 'express';
import upload from '../middleware/upload.middleware';
import * as postController from '../controllers/post.controller';
import { authenticateJWT } from '../middleware/authenJWT.middleware';
import { checkPostOwner } from '../middleware/post.middleware';
import { checkLoginUser } from '../middleware/checkLoginUser.middleware';

const router = Router();

router.get('/', postController.getAllPost);
router.get('/user-posts/:userId', authenticateJWT, checkLoginUser, postController.getPostsByUserId);
router.get('/:id', authenticateJWT, checkLoginUser, postController.getPostById);
router.get('/count-shared-post/:id', checkLoginUser, postController.countTotalSharedPostById);

router.post('/create/', authenticateJWT, checkLoginUser, upload.array('media', 10), postController.createPost); // 'media' là tên field gửi lên từ client + cho phép up tối đa 10 file cùng lúc
router.post('/create-shared-post/', authenticateJWT, checkLoginUser, postController.createSharedPost);

router.patch('/edit/:id', authenticateJWT, checkLoginUser, checkPostOwner, postController.updatePost);

router.delete('/delete/:id', authenticateJWT, checkLoginUser, checkPostOwner, postController.deletePost);

export default router;