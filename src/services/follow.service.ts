import dayjs from 'dayjs';
import * as followDal from '../dal/follow.dal';
import { validFollowStatus } from '../services/validate_input_payload.service';
import * as userDal from '../dal/user.dal';
import { NotificationType } from '../utils/enums';
import { generateNotificationContent, createNotification } from './notification.service';
import { getIO } from '../socket/socket';
export const getAllFollowerUser = async (targetUserId: string) => {
    const followerUser = await followDal.getAllFollowerDAL(targetUserId);
    return followerUser;
};

export const getAllFollowingUser = async (followerId: string) => {
    const followingUser = await followDal.getAllFollowingUserDAL(followerId);
    return followingUser;
};

export const countFollower = async (targetUserId: string) => {
    const followerUserCount = await followDal.countFollowerDAL(targetUserId);
    return followerUserCount;
};

export const countFollowing = async (followerId: string) => {
    const followingUserCount = await followDal.countFollowingDAL(followerId);
    return followingUserCount;
};

export const followUser = async (loginUserId: string, targetUserId: string) => {
    const existingFollow = await followDal.getFollowByUserIdsDAL(loginUserId, targetUserId);
    // Kiểm tra đã tồn tại record hay chưa
    if (!existingFollow) {
        const targetUser = await userDal.getUserByIdDAL(targetUserId); // Lấy user để kiểm tra có phải private hay public
        const followStatus = targetUser.is_private ? 'PENDING' : 'APPROVED';
        validFollowStatus(followStatus);

        const follow = await followDal.followUserDAL(loginUserId, targetUserId, followStatus);
        if (!follow || !follow.id) throw new Error('Failed to create follow record');

        await sendFollowNotification(loginUserId, targetUserId, follow.id, followStatus);
        return;
    }

    if (existingFollow.status === 'CANCELED') {
        const targetUser = await userDal.getUserByIdDAL(targetUserId);
        const followStatus = targetUser.is_private ? 'PENDING' : 'APPROVED';

        validFollowStatus(followStatus);
        const follow = await followDal.updateFollowStatusDAL(loginUserId, targetUserId, followStatus);
        if (!follow || !follow.id) throw new Error('Failed to update follow record');

        await sendFollowNotification(targetUserId, loginUserId, follow.id, followStatus);
        return;
    }

    if (existingFollow.status === 'PENDING') {
        throw new Error('Your follow request is pending approval');
    }
    if (existingFollow.status === 'APPROVED' || existingFollow.status === 'ACCEPTED') {
        throw new Error('You was follow this user before');
    }
};

export const updateFollowStatus = async (loginUserId: string, targetUserId: string, followStatus: string) => {
    validFollowStatus(followStatus);
    const follow = await followDal.updateFollowStatusDAL(loginUserId, targetUserId, followStatus);
    if (!follow || follow.length === 0) throw new Error('Failed to update follow record');

    await sendFollowNotification(targetUserId, loginUserId, follow.id, followStatus);
    return;
};

export const deleteFollower = async (loginUserId: string, targetUserId: string) => {
    return await followDal.deleteFollowerDAL(loginUserId, targetUserId);
};

// Hàm hỗ trợ gửi thông báo 
const sendFollowNotification = async (loginUserId: string, targetUserId: string, followId: string, followStatus: string) => {
    const user = await userDal.getUserByIdDAL(loginUserId);
    // Nội dung tin nhắn dựa vào status
    let notificationContent = '' as NotificationType;
    if (followStatus === 'PENDING') {
        notificationContent = NotificationType.FOLLOW_REQUEST;
    } else if (followStatus === 'ACCEPTED') {
        notificationContent = NotificationType.FOLLOW_ACCEPTED;
    } else if (followStatus === 'APPROVED') {
        notificationContent = NotificationType.NEW_FOLLOW;
    } else {
        return;
    }

    const io = getIO();
    if (!io) throw new Error('WebSocket IO instance not available');

    // Tạo bản ghi dưới DB
    const notification = await createNotification({
        recipient_id: targetUserId,
        sender_id: loginUserId,
        content: generateNotificationContent(notificationContent, user.username),
        post_id: undefined,
        comment_id: undefined,
        follow_id: followId
    });

    try {
        // Tiến hành gửi tới userId với event = notification + nội dung 
        io.to(targetUserId).emit("notification", {
            id: notification.id,
            recipient_id: targetUserId,
            sender_id: loginUserId,
            content: notification.content,
            follow_id: followId,
            status: followStatus,
            created_at: dayjs(notification.created_at).format('YYYY-MM-DD HH:mm:ss'),
            type: notificationContent
        });
        console.log(`Notification sent to ${targetUserId}`);
    } catch (error) {
        throw new Error(`Failed to send notification to ${targetUserId}: ${error}`);
    }
};