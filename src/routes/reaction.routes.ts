import * as reactionController from '../controllers/reaction.controller';
import { Router } from 'express';
import { authenticateJWT } from '../middleware/authenJWT.middleware';

const router = Router();

router.get('/:type', authenticateJWT, reactionController.getReactionByUserIdAndType);

//Posts
router.get('/post/:id', reactionController.getAllReactionsByPostId);
router.get('/post/:id/:type', reactionController.getAllReactionsByPostIdAndType);
router.get('/post-count/:id', reactionController.countReactionsByPostId);
router.get('/post-count/:id/:type', reactionController.countReactionsByPostIdAndType);

//Comments
router.get('/comment/:id', reactionController.getAllReactionsByCommentId);
router.get('/comment/:id/:type', reactionController.getAllReactionsByCommentIdAndType);
router.get('/comment/count/:id', reactionController.countReactionsByCommentId);
router.get('/comment/count/:id/:type', reactionController.countReactionsByCommentIdAndType);

// Create reaction
router.post('/create', authenticateJWT, reactionController.createReaction);

// Delete reaction
router.delete('/delete/:id', reactionController.deleteReaction);

export default router;