import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authenJWT.middleware";
import * as notificationService from "../services/notification.service";
import { formatResponse } from "../utils/responseFormat";
import { ErrorMessage } from "../utils/errorEnums";

export const getNotificationsByUserId = async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await notificationService.getNotificationsByUserId(req.user!.id);
        res.status(200).json(formatResponse(200, undefined, notifications));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const countNonReadedNotification = async (req: AuthRequest, res: Response) => {
    try {
        const notificationCount = await notificationService.countNonReadedNotification(req.user!.id);
        res.status(200).json(formatResponse(200, undefined, notificationCount));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const updateNotificationStatus = async (req: Request, res: Response) => {
    try {
        await notificationService.updateNotificationStatus(req.params.notificationId);
        res.status(200).json(formatResponse(200, ErrorMessage.NOTIFICATION_UPDATED));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        await notificationService.deleteNotification(req.params.notificationId);
        res.status(200).json(formatResponse(200, ErrorMessage.NOTIFICATION_DELETED));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};