import { Router } from 'express';
import authRoute from './authentication.routes';
import userRoute from './user.routes';
import postRoute from './post.routes';
import commentRoute from './comment.route';

const router = Router();

router.use('/authen', authRoute);
router.use('/user', userRoute);
router.use('/post', postRoute);
router.use('/comment', commentRoute);

export default router;
