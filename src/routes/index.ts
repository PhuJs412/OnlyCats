import { Router } from 'express';
import authRoute from './authentication.routes';

const router = Router();

router.use('/authen', authRoute);

export default router;
