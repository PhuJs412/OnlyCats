import { Router } from 'express';
import * as followController from '../controllers/follow.controller';
import { authenticateJWT } from '../middleware/authenJWT.middleware';

const router = Router();

router.get('/follower/:targetUserId', followController.getAllFollowerUser);
router.get('/following/:followerId', followController.getAllFollowingUser);
router.get('/count-follower/:targetUserId', followController.countFollower);
router.get('/count-following/:followerId', followController.countFollowing);

router.post('/create/:targetUserId', authenticateJWT, followController.followUser);

router.patch('/edit-status/:targetUserId', authenticateJWT, followController.updateFollowStatus);

router.delete('/delete/:targetUserId', authenticateJWT, followController.deleteFollower);

export default router;