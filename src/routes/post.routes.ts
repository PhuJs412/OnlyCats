import { Router } from 'express';
import upload from '../middleware/cloudinary.third-party/upload.middleware';
import * as postController from '../controllers/post.controller';
import { checkPostOwner } from '../middleware/post/post.middleware';

const router = Router();


router.get('/', postController.getAllPost);
router.get('/user-posts/:userId',  postController.getPostsByUserId);
router.get('/:id',  postController.getPostById);
router.get('/count-shared-post/:id', postController.countTotalSharedPostById);

router.post('/create/', upload.array('media', 10), postController.createPost); // 'media' là tên field gửi lên từ client + cho phép up tối đa 10 file cùng lúc
router.post('/create-shared-post/', postController.createSharedPost);

// Kiểm tra post owner
router.use(checkPostOwner);

router.patch('/edit/:id', postController.updatePost);
router.delete('/delete/:id', postController.deletePost);

export default router;