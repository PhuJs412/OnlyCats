import { Router } from 'express';
import authRoute from './authentication.routes';
import userRoute from './user.routes';


const router = Router();

router.use('/authen', authRoute);
router.use('/user', userRoute)
export default router;
