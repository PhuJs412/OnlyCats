import { Request, Response } from "express";
import * as postService from '../services/post.service';
import { PostUpdate } from "../models/post.update.model";
import { AuthRequest } from "../middleware/authenJWT.middleware";

export const getAllPost = async (req: Request, res: Response) => {
    try {
        const posts = await postService.getAllPost();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getPostsByUserId = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id; // Lấy id từ token
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const posts = await postService.getPostsByUserId(userId, req.params.id);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};