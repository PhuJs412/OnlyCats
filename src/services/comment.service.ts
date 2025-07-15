import * as commentDal from '../dal/comment.dal';
import { CommentUpdate } from '../models/comment.update.model';

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

export const getReplyByCommentId = async (comment_id: string) => {
    const reply = await commentDal.getReplyByCommentIdDAL(comment_id);
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

export const createComment = async (
    user_id: string,
    post_id: string,
    content: string,
) => {
    return await commentDal.createCommentDAL(user_id, post_id, content);
};

export const createReply = async (
    user_id: string,
    post_id: string,
    content: string,
    parent_comment_id: string
) => {
    return await commentDal.createReplyDAL(user_id, post_id, content, parent_comment_id);
};

export const updateComment = async (comment: CommentUpdate, comment_id: string) => {
    return await commentDal.updateCommentDAL(comment, comment_id);
};

export const deleteCommentDAL = async (comment_id: string) => {
    return await commentDal.deleteCommentDAL(comment_id);
}