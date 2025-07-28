import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';

const router = Router();

router.get('/:post_id', commentController.getAllCommentByPostId);
router.get('/get-one/:comment_id', commentController.getCommentById);
router.get('/replies/:comment_id', commentController.getRepliesByCommentId);
router.get('/count/:post_id', commentController.countCommentByPostId);
router.get('/reply-count/:comment_id', commentController.countReplyByCommentId);
router.post('/create', commentController.createComment);
router.post('/create-reply', commentController.createReply);
router.patch('/edit/:comment_id', commentController.updateComment);
router.delete('/delete/:comment_id', commentController.deleteComment);

export default router