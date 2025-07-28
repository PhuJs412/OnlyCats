import dayjs from 'dayjs';
import * as notificationDal from "../dal/notification.dal";
import { Notification } from "../models/notification.model";
import { NotificationType } from "../utils/validInputEnums";
import { ReactionType } from "../utils/validInputEnums";
import { ErrorMessage } from '../utils/errorEnums';

export const getNotificationsByUserId = async (recipient_id: string): Promise<Notification[]> => {
    const notifications: Notification[] = await notificationDal.getNotificationsByUserIdDAL(recipient_id);
    return notifications;
};

export const countNonReadedNotification = async (recipient_id: string): Promise<string> => {
    const notificationsCount = await notificationDal.countNonReadedNotificationDAL(recipient_id);
    return notificationsCount;
};

export const createNotification = async (notification: Notification): Promise<Notification> => {
    const { recipient_id, sender_id, content, post_id, comment_id, follow_id, created_at } = notification;
    // Kiểm tra các field quan trọng
    if (!recipient_id) throw new Error(ErrorMessage.RECIPIENT_ID_REQUIRED);
    if (!sender_id) throw new Error(ErrorMessage.SENDER_ID_REQUIRED);
    if (!content) throw new Error(ErrorMessage.CONTENT_NOTIFICATION_REQUIRED);

    try {
        const createdNotification = await notificationDal.createNotificationDAL(
            recipient_id,
            sender_id,
            content,
            post_id,
            comment_id,
            follow_id
        );

        if (!createdNotification || !createdNotification.id) {
            throw new Error(ErrorMessage.FAILED_CREATE_NOTIFICATION);
        }

        return createdNotification;
    } catch (error) {
        throw new Error(`Failed to create notification: ${error}`);
    }
};

export const updateNotificationStatus = async (notification_id: string) => {
    return await notificationDal.updateNotificationStatusDAL(notification_id);
};

export const deleteNotification = async (notification_id: string) => {
    return await notificationDal.deleteNotificationDAL(notification_id);
};

export const generateNotificationContent = (
    type: NotificationType,
    senderName: string,
    ...arg: [ReactionType?] // Khai res param và mong đợi 1 tham số reactionType, có thể undefined
): string => {
    const [reactionType] = arg;
    switch (type) {
        case NotificationType.NEW_POST:
            return `${senderName} vừa đăng một bài viết mới.`;
        case NotificationType.NEW_SHARED_POST:
            return `${senderName} vừa chia sẻ một bài viết.`;

        case NotificationType.COMMENT:
            return `${senderName} đã bình luận vào bài viết của bạn.`;
        case NotificationType.REPLY:
            return `${senderName} đã phản hồi bình luận của bạn.`;

        case NotificationType.NEW_FOLLOW:
            return `${senderName} đã theo dõi bạn.`;
        case NotificationType.FOLLOW_REQUEST:
            return `${senderName} đã gửi lời mời theo dõi bạn.`;
        case NotificationType.FOLLOW_ACCEPTED:
            return `${senderName} đã chấp nhận lời mời theo dõi của bạn.`;
        case NotificationType.REACTION_POST:
            return reactionType ? `${senderName} đã thả ${reactionType} vào bài viết của bạn.` : '';
        case NotificationType.REACTION_COMMENT:
            return reactionType ? `${senderName} đã thả ${reactionType} vào bình luận của bạn.` : '';
        default:
            return 'Bạn có một thông báo mới.';
    }
}
