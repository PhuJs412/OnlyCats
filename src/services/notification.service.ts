import * as notificationDal from "../dal/notification.dal";
import { Notification } from "../models/notification.model";
import { NotificationType } from "../utils/enums";

export const getNotificationsByUserId = async (recipient_id: string): Promise<Notification[]> => {
    const notifications: Notification[] = await notificationDal.getNotificationsByUserIdDAL(recipient_id);
    return notifications;
};

export const countNonReadedNotification = async (recipient_id: string): Promise<string> => {
    const notificationsCount = await notificationDal.countNonReadedNotificationDAL(recipient_id);
    return notificationsCount;
};

export const createNotification = async (notification: Notification) => {
    const {
        recipient_id,
        sender_id,
        content,
        post_id,
        comment_id,
        follow_id
    } = notification;
    return await notificationDal.createNotificationDAL(
        recipient_id,
        sender_id,
        content,
        post_id,
        comment_id,
        follow_id
    );
};

export const updateNotificationStatus = async (notification_id: string) => {
    return await notificationDal.updateNotificationStatusDAL(notification_id);
};

export const deleteNotification = async (notification_id: string) => {
    return await notificationDal.deleteNotificationDAL(notification_id);
};

export const generateNotificationContent = (type: NotificationType, senderName: string): string => {
    switch (type) {
        case NotificationType.NEW_POST:
            return `${senderName} vừa đăng một bài viết mới.`;
        case NotificationType.NEW_COMMENT:
            return `${senderName} đã bình luận vào bài viết của bạn.`;
        case NotificationType.NEW_FOLLOW:
            return `${senderName} đã gửi lời mời theo dõi bạn.`;
        case NotificationType.FOLLOW_ACCEPTED:
            return `${senderName} đã chấp nhận lời mời theo dõi của bạn.`;
        default:
            return 'Bạn có một thông báo mới.';
    }
}
