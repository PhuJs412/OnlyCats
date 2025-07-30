import dayjs from 'dayjs';
import * as reactionsDAL from '../dal/reaction.dal';
import { Reactions } from '../models/reactions.model';
import { generateNotificationContent } from './notification.service';
import { NotificationType, ReactionType } from '../enums/validInputEnums';
import { getUserByIdDAL } from '../dal/user.dal';
import { getIO } from '../socket/socket';
import { createNotification } from './notification.service';
import { getPostByIdDAL } from '../dal/post.dal';
import { getCommentByIdDAL } from '../dal/comment.dal';
import { validReactionType } from './validate_input_payload.service';
import { ErrorMessage } from '../enums/errorEnums';

//POSTS
export const getAllReactionsByPostId = async (postId: string) => {
    const reactions = await reactionsDAL.getAllReactionsByPostIdDAL(postId);
    return reactions;
}

export const getAllReactionsByPostIdAndType = async (postId: string, type: string) => {
    validReactionType(type);
    const reactions = await reactionsDAL.getAllReactionsByPostIdAndTypeDAL(postId, type);
    return reactions;
}

export const getExistedReactionByUserIdAndPostId = async (userId: string, postId: string) => {
    const reactions = await reactionsDAL.getExistedReactionByUserIdAndPostIdDAL(userId, postId);
    return reactions;
}

export const countReactionsByPostId = async (postId: string) => {
    const count = await reactionsDAL.countReactionsByPostIdDAL(postId);
    return count;
}

export const countReactionsByPostIdAndType = async (postId: string, type: string) => {
    validReactionType(type);
    const count = await reactionsDAL.countReactionsByPostIdAndTypeDAL(postId, type);
    return count;
}
// ** END - POSTS **


// COMMENTS
export const getAllReactionsByCommentId = async (commentId: string) => {
    const reactions = await reactionsDAL.getAllReactionsByCommentIdDAL(commentId);
    return reactions;
}

export const getAllReactionsByCommentIdAndType = async (commentId: string, type: string) => {
    validReactionType(type);
    const reactions = await reactionsDAL.getAllReactionsByCommentIdAndTypeDAL(commentId, type);
    return reactions;
}

export const getExistedReactionByUserIdAndCommentId = async (userId: string, comment_id: string) => {
    const reactions = await reactionsDAL.getExistedReactionByUserIdAndCommentIdDAL(userId, comment_id);
    return reactions;
}

export const countReactionsByCommentId = async (commentId: string) => {
    const count = await reactionsDAL.countReactionsByCommentIdDAL(commentId);
    return count;
}

export const countReactionsByCommentIdAndType = async (commentId: string, type: string) => {
    validReactionType(type);
    const count = await reactionsDAL.countReactionsByCommentIdAndTypeDAL(commentId, type);
    return count;
}
// ** END - COMMENTS **


export const createReaction = async (
    loginUserId: string,
    postId: string,
    commentId: string,
    type: string
) => {
    let reaction: Reactions = {} as Reactions;

    validReactionType(type);

    if (postId) {
        const postReactionExists = await reactionsDAL.getExistedReactionByUserIdAndPostIdDAL(loginUserId, postId);

        // Nếu không có loại reaction, xóa reaction hiện tại
        if (!type) {
            await reactionsDAL.deleteReactionDAL(postReactionExists.id);
        }

        // Nếu đã có reaction cho post, cập nhật loại reaction
        if (postReactionExists) {
            await reactionsDAL.updatePostReactionTypeDAL(loginUserId, postId, type);
            reaction = { loginUserId, postId, type } as Reactions;
        } else {

            // Nếu chưa có reaction, tạo mới
            reaction = await reactionsDAL.createReactionDAL(loginUserId, postId, commentId, type);
            if (!reaction) throw new Error(ErrorMessage.FAILED_CREATE_REACTION);
        }
    } else if (commentId) {
        const commentReactionExists = await reactionsDAL.getExistedReactionByUserIdAndCommentIdDAL(loginUserId, commentId);

        if (!type) {
            await reactionsDAL.deleteReactionDAL(commentReactionExists.id);
        }

        if (commentReactionExists) {
            await reactionsDAL.updateCommentReactionTypeDAL(loginUserId, commentId, type);
            reaction = { loginUserId, postId, type } as Reactions;

        } else {
            reaction = await reactionsDAL.createReactionDAL(loginUserId, postId, commentId, type);
            if (!reaction) throw new Error(ErrorMessage.FAILED_CREATE_REACTION);
        }
    }

    await sendReactionNotification(reaction, loginUserId, postId, commentId);
    return;
};

export const deleteReaction = async (reactionId: string) => {
    return await reactionsDAL.deleteReactionDAL(reactionId);
};

// Hỗ trợ gửi thông báo reaction
export const sendReactionNotification = async (reaction: Reactions, loginUserId: string, postId: string, commentId: string) => {
    const user = await getUserByIdDAL(loginUserId);
    const post = await getPostByIdDAL(postId);
    const comment = await getCommentByIdDAL(commentId);

    const reactionType = reaction.type as ReactionType;
    const io = getIO();

    const notificationType = commentId ? NotificationType.REACTION_COMMENT : NotificationType.REACTION_POST;
    const notificationContent = generateNotificationContent(notificationType, user.username, reactionType);
    const notification = await createNotification({
        recipient_id: post ? post.user_id : comment.user_id,
        sender_id: loginUserId,
        content: notificationContent,
        post_id: postId ? postId : undefined,
        comment_id: commentId ? commentId : undefined,
        follow_id: undefined,
    });

    try {
        io.to(post ? post.user_id : comment.user_id).emit('notification', {
            id: notification.id,
            recipient_id: post ? post.user_id : comment.user_id,
            sender_id: loginUserId,
            content: notificationContent,
            post_id: postId ? postId : undefined,
            comment_id: commentId ? commentId : undefined,
            created_at: dayjs(notification.created_at).format('YYYY-MM-DD HH:mm:ss'),
            type: notificationType
        });
        console.log(`Notification sent for reaction: ${notification.id}`);
    } catch (error) {
        throw new Error(`Failed to create reaction notification: ${error}`);
    }
}