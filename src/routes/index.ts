import { Router } from 'express';
import authRoute from './authentication.routes';
import userRoute from './user.routes';
import postRoute from './post.routes';

const router = Router();

router.use('/authen', authRoute);
router.use('/user', userRoute);
router.use('/post', postRoute);
export default router;
