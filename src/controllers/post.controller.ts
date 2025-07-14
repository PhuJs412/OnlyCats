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
        const loginUserId = req.user?.id || ''; // Lấy id từ token
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        const posts = await postService.getPostsByUserId(loginUserId, req.params.userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getPostById = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || ''; // Lấy id từ token

        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        const postId = req.params.id;

        const posts = await postService.getPostById(loginUserId, req.params.id);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countTotalSharedPostById = async (req: Request, res: Response) => {
    try {
        const countSharedPost = await postService.countTotalSharedPostByIdL(req.params.id);
        res.status(200).json(countSharedPost);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || ''; // Lấy id từ token
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        const { content, media_url, visibility } = req.body;
        await postService.createPostDAL(loginUserId, content, media_url, visibility);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createSharedPost = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        const { shared_post_id, content, visibility } = req.body;
        await postService.createSharedPost(loginUserId, shared_post_id, content, visibility);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        const Post: PostUpdate = req.body;
        await postService.updatePost(loginUserId, Post, req.params.id);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        await postService.deletePost(loginUserId, req.params.id);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};