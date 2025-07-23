import * as notificationController from "../controllers/notification.controller";
import { Router } from "express";
import { authenticateJWT } from "../middleware/authenJWT.middleware";
const router = Router();

router.get('/', authenticateJWT, notificationController.getNotificationsByUserId);
router.get('/count', authenticateJWT, notificationController.countNonReadedNotification);
router.patch('/change-status/:notificationId', authenticateJWT, notificationController.updateNotificationStatus);
router.delete('/delete/:notificationId', authenticateJWT, notificationController.deleteNotification);

export default router;