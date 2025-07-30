import { Request, Response } from "express";
import * as followService from '../services/follow.service';
import { AuthRequest } from "../middleware/authenJWT.middleware";
import { formatResponse } from "../utils/responseFormat";
import { SuccessfulEnums } from "../enums/successfulEnums";

export const getAllFollowerUser = async (req: Request, res: Response) => {
    try {
        const followers = await followService.getAllFollowerUser(req.params.targetUserId);
        res.status(200).json(formatResponse(200, undefined, followers));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const getAllFollowingUser = async (req: Request, res: Response) => {
    try {
        const following = await followService.getAllFollowingUser(req.params.followerId);
        res.status(200).json(formatResponse(200, undefined, following));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const countFollower = async (req: Request, res: Response) => {
    try {
        const followerCount = await followService.countFollower(req.params.targetUserId);
        res.status(200).json(formatResponse(200, undefined, followerCount));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const countFollowing = async (req: Request, res: Response) => {
    try {
        const followingCount = await followService.countFollowing(req.params.followerId);
        res.status(200).json(formatResponse(200, undefined, followingCount));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const followUser = async (req: AuthRequest, res: Response) => {
    try {
        await followService.followUser(req.user!.id, req.params.targetUserId);
        res.status(200).json(formatResponse(200, SuccessfulEnums.FOLLOW_CREATED));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const updateFollowStatus = async (req: AuthRequest, res: Response) => {
    try {
        await followService.updateFollowStatus(req.user!.id, req.params.targetUserId, req.body.followStatus);
        res.status(200).json(formatResponse(200, SuccessfulEnums.FOLLOW_UPDATED));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const deleteFollower = async (req: AuthRequest, res: Response) => {
    try {
        await followService.deleteFollower(req.user!.id, req.params.targetUserId);
        res.status(200).json(formatResponse(200, SuccessfulEnums.FOLLOW_DELETED));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};