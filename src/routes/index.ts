import { Router } from 'express';
import authRoute from './authentication.routes';
import userRoute from './user.routes';
import postRoute from './post.routes';
import commentRoute from './comment.route';
import followRoute from './follow.routes';

const router = Router();

router.use('/authen', authRoute);
router.use('/user', userRoute);
router.use('/post', postRoute);
router.use('/comment', commentRoute);
router.use('/follow', followRoute);

export default router;
