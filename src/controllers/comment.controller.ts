import { Request, Response } from 'express';
import * as commentService from '../services/comment.service';
import { CommentUpdate } from '../models/comment.update.model';
import { AuthRequest } from '../middleware/authenJWT.middleware';
import { formatResponse } from "../utils/responseFormat";
import { SuccessfulEnums } from '../utils/successfulEnums';

export const getAllCommentByPostId = async (req: Request, res: Response) => {
    try {
        const comments = await commentService.getAllCommentByPostId(req.params.post_id);
        res.status(200).json(formatResponse(200, undefined, comments));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const getCommentById = async (req: Request, res: Response) => {
    try {
        const comment = await commentService.getCommentById(req.params.comment_id);
        res.status(200).json(formatResponse(200, undefined, comment));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const getRepliesByCommentId = async (req: Request, res: Response) => {
    try {
        const replies = await commentService.getRepliesByCommentId(req.params.comment_id);
        res.status(200).json(formatResponse(200, undefined, replies));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const countCommentByPostId = async (req: Request, res: Response) => {
    try {
        const commentCount = await commentService.countCommentByPostId(req.params.post_id);
        res.status(200).json(formatResponse(200, undefined, commentCount));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const countReplyByCommentId = async (req: Request, res: Response) => {
    try {
        const replyCount = await commentService.countReplyByCommentId(req.params.comment_id);
        res.status(200).json(formatResponse(200, undefined, replyCount));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        const { post_id, content } = req.body;
        await commentService.createComment(loginUserId, post_id, content);
        res.status(200).json(formatResponse(200, SuccessfulEnums.COMMENT_CREATED));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const createReply = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        const { post_id, content, parent_comment_id } = req.body;

        await commentService.createReply(loginUserId, post_id, content, parent_comment_id);
        res.status(200).json(formatResponse(200, SuccessfulEnums.REPLY_CREATED));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        const comment: CommentUpdate = req.body;

        await commentService.updateComment(loginUserId, comment, req.params.comment_id);
        res.status(200).json(formatResponse(200, SuccessfulEnums.UPDATE_COMMENT));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        await commentService.deleteCommentDAL(req.params.comment_id);
        res.status(200).json(formatResponse(200, SuccessfulEnums.DELETE_COMMENT));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

