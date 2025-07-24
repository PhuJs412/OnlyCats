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
        const posts = await postService.getPostsByUserId(req.user!.id, req.params.userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getPostById = async (req: AuthRequest, res: Response) => {
    try {
        const posts = await postService.getPostById(req.user!.id, req.params.id);
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
        const mediaUrl = req.file?.path || ''; // Lấy đường dẫn media từ file upload
        const { content, visibility } = req.body;

        await postService.createPostDAL(req.user!.id, content, mediaUrl, visibility);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createSharedPost = async (req: AuthRequest, res: Response) => {
    try {
        const { shared_post_id, content, visibility } = req.body;
        await postService.createSharedPost(req.user!.id, shared_post_id, content, visibility);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const Post: PostUpdate = req.body;
        await postService.updatePost(req.user!.id, Post, req.params.id);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        await postService.deletePost(req.user!.id, req.params.id);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};