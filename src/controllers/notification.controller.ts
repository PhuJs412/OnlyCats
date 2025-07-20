import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authenJWT.middleware";
import * as notificationService from "../services/notification.service";

export const getNotificationsByUserId = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId: string = req.user?.id || '';
        const notifications = await notificationService.getNotificationsByUserId(loginUserId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const countNonReadedNotification = async (req: AuthRequest, res: Response) => {
    try {
        const loginUserId: string = req.user?.id || '';
        const notificationCount = await notificationService.countNonReadedNotification(loginUserId);
        res.status(200).json(notificationCount);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateNotificationStatus = async (req: Request, res: Response) => {
    try {
        await notificationService.updateNotificationStatus(req.params.notificationId);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        await notificationService.deleteNotification(req.params.notificationId);
        res.status(200).json('Ok');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};