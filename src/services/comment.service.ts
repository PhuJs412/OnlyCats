import * as commentDal from '../dal/comment.dal';
import { CommentUpdate } from '../models/comment.update.model';
import { getPostByIdDAL } from '../dal/post.dal';
import { getIO } from '../socket/socket';
import { NotificationType } from '../utils/enums';
import { generateNotificationContent } from './notification.service';
import { createNotification } from './notification.service';
import { Comments } from '../models/comment.model';
import { getUserByIdDAL } from '../dal/user.dal';

export const getAllCommentByPostId = async (post_id: string) => {
    const comments = await commentDal.getAllCommentByPostIdDAL(post_id);
    return comments;
};

export const getCommentById = async (comment_id: string) => {
    const comment = await commentDal.getCommentByIdDAL(comment_id);
    return comment;
};

export const getRepliesByCommentId = async (comment_id: string) => {
    const reply = await commentDal.getRepliesByCommentIdDAL(comment_id);
    return reply;
};

export const countCommentByPostId = async (post_id: string) => {
    const commentCount = await commentDal.countCommentByPostIdDAL(post_id);
    return commentCount;
};

export const countReplyByCommentId = async (comment_id: string) => {
    const replyCount = await commentDal.countReplyByCommentIdDAL(comment_id);
    return replyCount;
};

// Hàm tạo comment
export const createComment = async (loginUserId: string, postId: string, content: string) => {
        console.log(loginUserId)
        console.log(postId)

    if (!postId || !content) throw new Error('Post ID and content are required');

    try {
        const comment = await commentDal.createCommentDAL(loginUserId, postId, content);
        if (!comment || !comment.id) throw new Error('Failed to create comment');

        await sendCommentNotification(loginUserId, postId, comment);
        return comment; // Trả về comment để client sử dụng
    } catch (error) {
        throw new Error(`Failed to create comment: ${error}`);
    }
};

// Hàm tạo reply
export const createReply = async (loginUserId: string, postId: string, content: string, parentCommentId: string) => {
    if (!postId || !content || !parentCommentId) throw new Error('Post ID, content, and parent comment ID are required');

    try {
        const reply = await commentDal.createReplyDAL(loginUserId, postId, content, parentCommentId);
        if (!reply || !reply.id) throw new Error('Failed to create reply');

        await sendCommentNotification(loginUserId, postId, reply);
        return reply; // Trả về reply để client sử dụng
    } catch (error) {
        throw new Error(`Failed to create reply: ${error}`);
    }
};

export const updateComment = async (comment: CommentUpdate, comment_id: string) => {
    return await commentDal.updateCommentDAL(comment, comment_id);
};

export const deleteCommentDAL = async (comment_id: string) => {
    return await commentDal.deleteCommentDAL(comment_id);
}

export const deleteAllComment = async (post_id: string) => {
    return await commentDal.deleteAllCommentDAL(post_id);
}

// Hỗ trợ gửi thông báo comment hoặc reply
const sendCommentNotification = async (loginUserId: string, postId: string, comment: Comments) => {
    const post = await getPostByIdDAL(postId);
    if (!post) throw new Error('Post not found');

    const user = await getUserByIdDAL(loginUserId);
    const io = getIO();

    const isReply = !!comment.parent_comment_id;
    const recipientId = isReply ? (comment.user_id || '') : (post.user_id || '');
    if (!recipientId) throw new Error('Recipient ID is missing');

    const notificationType = isReply ? NotificationType.REPLY : NotificationType.COMMENT;
    const content = generateNotificationContent(notificationType, user.username);

    const notification = await createNotification({
        recipient_id: recipientId,
        sender_id: loginUserId,
        content,
        post_id: undefined,
        comment_id: comment.id,
        follow_id: undefined
    });

    try {
        io.to(recipientId).emit('notification', {
            id: notification.id,
            recipient_id: recipientId,
            sender_id: loginUserId,
            content,
            comment_id: comment.id,
            created_at: notification.created_at,
            type: notificationType
        });
        console.log(`Notification sent to ${recipientId}`);
    } catch (error) {
        throw new Error(`Failed to send notification to ${recipientId}: ${error}`);
    }
};