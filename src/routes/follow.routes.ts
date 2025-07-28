import { Router } from 'express';
import * as followController from '../controllers/follow.controller';

const router = Router();

router.get('/follower/:targetUserId', followController.getAllFollowerUser);
router.get('/following/:followerId', followController.getAllFollowingUser);
router.get('/count-follower/:targetUserId', followController.countFollower);
router.get('/count-following/:followerId', followController.countFollowing);

router.post('/create/:targetUserId', followController.followUser);

router.patch('/edit-status/:targetUserId', followController.updateFollowStatus);

router.delete('/delete/:targetUserId', followController.deleteFollower);

export default router;