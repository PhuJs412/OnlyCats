import * as reactionsDAL from '../dal/reaction.dal';
import { Reactions } from '../models/reactions.model';
import { generateNotificationContent } from './notification.service';
import { NotificationType } from '../utils/enums';
import { User } from '../models/user.model';

//POSTS
export const getAllReactionsByPostId = async (postId: string) => { 
    const reactions = await reactionsDAL.getAllReactionsByPostIdDAL(postId);
    return reactions;
}

export const getAllReactionsByPostIdAndType = async (postId: string, type: string) => {
    const reactions = await reactionsDAL.getAllReactionsByPostIdAndTypeDAL(postId, type);
    return reactions;
}

export const countReactionsByPostId = async (postId: string) => {
    const count = await reactionsDAL.countReactionsByPostIdDAL(postId);
    return count;
}

export const countReactionsByPostIdAndType = async (postId: string, type: string) => {
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
    const reactions = await reactionsDAL.getAllReactionsByCommentIdAndTypeDAL(commentId, type);
    return reactions;
}

export const countReactionsByCommentId = async (commentId: string) => {
    const count = await reactionsDAL.countReactionsByCommentIdDAL(commentId);
    return count;
}

export const countReactionsByCommentIdAndType = async (commentId: string, type: string) => {
    const count = await reactionsDAL.countReactionsByCommentIdAndTypeDAL(commentId, type);
    return count;
}
// ** END - COMMENTS **


export const createReaction = async (
    userId: string,
    postId: string,
    commentId: string,
    type: string
) => {
    const reaction = await reactionsDAL.createReactionDAL(userId, postId, commentId, type);
    if(!reaction && reaction.id) {
        throw new Error('Failed to create reaction');
    }

    return ;
};

export const sendReactionNotification = async (reactionid: string, user: User, postId: string, commentId: string) => {
    
}