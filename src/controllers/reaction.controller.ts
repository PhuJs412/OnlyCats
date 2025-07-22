import * as reactionService from '../services/reaction.service';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authenJWT.middleware';


export const getReactionByUserIdAndType = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        console.log('loginUserId', loginUserId);
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        const reaction = await reactionService.getReactionByUserIdAndType(loginUserId, req.params.type);
        if (!reaction) {
            res.status(404).json({ message: 'No reaction found' });
        } else {
            res.status(200).json(reaction);
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// POSTS
export const getAllReactionsByPostId = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const reactions = await reactionService.getAllReactionsByPostId(postId);
        res.status(200).json(reactions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAllReactionsByPostIdAndType = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        console.log(postId)
        const type = req.params.type;
        const reactions = await reactionService.getAllReactionsByPostIdAndType(postId, type);
        res.status(200).json(reactions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countReactionsByPostId = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        console.log(req.params.id);
        const count = await reactionService.countReactionsByPostId(postId);
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countReactionsByPostIdAndType = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const type = req.params.type as string;
        console.log('postId', postId, 'type', type);
        const count = await reactionService.countReactionsByPostIdAndType(postId, type);
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
// ** END - POSTS **

// COMMENTS
export const getAllReactionsByCommentId = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        const reactions = await reactionService.getAllReactionsByCommentId(commentId);
        res.status(200).json(reactions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAllReactionsByCommentIdAndType = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        const type = req.query.type as string;
        const reactions = await reactionService.getAllReactionsByCommentIdAndType(commentId, type);
        res.status(200).json(reactions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countReactionsByCommentId = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        const count = await reactionService.countReactionsByCommentId(commentId);
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countReactionsByCommentIdAndType = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        const type = req.query.type as string;
        const count = await reactionService.countReactionsByCommentIdAndType(commentId, type);
        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
// ** END - COMMENTS **


export const createReaction = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        const { postId, commentId, type } = req.body;
        await reactionService.createReaction(loginUserId, postId, commentId, type);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const deleteReaction = async (req: Request, res: Response) => {
    try {
        const reactionId = req.params.id;
        await reactionService.deleteReaction(reactionId);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}