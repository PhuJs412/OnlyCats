import * as notificationController from "../controllers/notification.controller";
import { Router } from "express";

const router = Router();

router.get('/', notificationController.getNotificationsByUserId);
router.get('/count', notificationController.countNonReadedNotification);
router.patch('/change-status/:notificationId', notificationController.updateNotificationStatus);
router.delete('/delete/:notificationId', notificationController.deleteNotification);

export default router;