import { Request, Response } from 'express';
import * as commentService from '../services/comment.service';
import { CommentUpdate } from '../models/comment.update.model';
import { AuthRequest } from '../middleware/authenJWT.middleware';

export const getAllCommentByPostId = async (req: Request, res: Response) => {
    try {
        const comments = await commentService.getAllCommentByPostId(req.params.post_id);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    try {
        const comment = await commentService.getCommentById(req.params.comment_id);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getRepliesByCommentId = async (req: Request, res: Response) => {
    try {
        const comments = await commentService.getRepliesByCommentId(req.params.comment_id);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countCommentByPostId = async (req: Request, res: Response) => {
    try {
        const commentCount = await commentService.countCommentByPostId(req.params.post_id);
        res.status(200).json(commentCount);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countReplyByCommentId = async (req: Request, res: Response) => {
    try {
        const replyCount = await commentService.countReplyByCommentId(req.params.comment_id);
        res.status(200).json(replyCount);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        const { post_id, content } = req.body;
        console.log('abc: ', req.user?.id)
        await commentService.createComment(loginUserId, post_id, content);
        res.status(200).json('ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createReply = async (req: AuthRequest, res: Response) => {
    try {
        const loginuserId = req.user?.id || '';
        const { post_id, content, parent_comment_id } = req.body;
        await commentService.createReply(loginuserId, post_id, content, parent_comment_id);
        res.status(200).json('ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    try {
        const comment: CommentUpdate = req.body;
        await commentService.updateComment(comment, req.params.comment_id);
        res.status(200).json('ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        await commentService.deleteCommentDAL(req.params.comment_id);
        res.status(200).json('ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

