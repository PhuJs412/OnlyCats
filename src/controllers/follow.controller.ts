import { Request, Response } from "express";
import * as followService from '../services/follow.service';
import { AuthRequest } from "../middleware/authenJWT.middleware";

export const getAllFollowerUser = async (req: Request, res: Response) => {
    try {
        const followers = await followService.getAllFollowerUser(req.params.targetUserId);
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAllFollowingUser = async (req: Request, res: Response) => {
    try {
        const following = await followService.getAllFollowingUser(req.params.followerId);
        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countFollower = async (req: Request, res: Response) => {
    try {
        const followerCount = await followService.countFollower(req.params.targetUserId);
        res.status(200).json(followerCount);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countFollowing = async (req: Request, res: Response) => {
    try {
        const followingCount = await followService.countFollowing(req.params.followerId);
        res.status(200).json(followingCount);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const followUser = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        await followService.followUser(loginUserId, req.params.targetUserId);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateFollowStatus = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        
        await followService.updateFollowStatus(loginUserId, req.params.targetUserId, req.body.followStatus);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteFollower = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId = req.user?.id || '';
        if (!loginUserId) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        await followService.deleteFollower(loginUserId, req.params.targetUserId);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};