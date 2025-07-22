import * as reactionSQL from "../sql/reaction.sql";
import { pool } from "../config/pg.config";

// POSTS
export const getAllReactionsByPostIdDAL = async (postId: string) => {
    const res = await pool.query(reactionSQL.getAllReactionsByPostIdSQL, [postId]);
    return res.rows;
}

export const getAllReactionsByPostIdAndTypeDAL = async (postId: string, type: string) => {
    const res = await pool.query(reactionSQL.getAllReactionsByPostIdAndTypeSQL, [postId, type]);
    return res.rows;
}

export const getExistedReactionByUserIdAndPostIdDAL = async (userId: string, post_id: string) => {
    const res = await pool.query(reactionSQL.getExistedReactionByUserIdAndPostIdSQL, [userId, post_id]);
    return res.rows[0];
}

export const countReactionsByPostIdDAL = async (postId: string) => {
    const res = await pool.query(reactionSQL.countReactionsByPostIdSQL, [postId]);
    return res.rows[0];
}

export const countReactionsByPostIdAndTypeDAL = async (postId: string, type: string) => {
    const res = await pool.query(reactionSQL.countReactionsByPostIdAndTypeSQL, [postId, type]);
    return res.rows[0];
}
// ** END - POSTS **

// COMMENTS
export const getAllReactionsByCommentIdDAL = async (commentId: string) => {
    const res = await pool.query(reactionSQL.getAllReactionsByCommentIdSQL, [commentId]);
    return res.rows;
}

export const getAllReactionsByCommentIdAndTypeDAL = async (commentId: string, type: string) => {
    const res = await pool.query(reactionSQL.getAllReactionsByCommentIdAndTypeSQL, [commentId, type]);
    return res.rows;
}

export const getExistedReactionByUserIdAndCommentIdDAL = async (userId: string, comment_id: string) => {
    const res = await pool.query(reactionSQL.getExistedReactionByUserIdAndCommentIdSQL, [userId, comment_id]);
    return res.rows[0];
}

export const countReactionsByCommentIdDAL = async (commentId: string) => {
    const res = await pool.query(reactionSQL.countReactionsByCommentIdSQL, [commentId]);
    return res.rows[0];
}

export const countReactionsByCommentIdAndTypeDAL = async (commentId: string, type: string) => {
    const res = await pool.query(reactionSQL.countReactionsByCommentIdAndTypeSQL, [commentId, type]);
    return res.rows[0];
}
// ** END - COMMENTS **

export const createReactionDAL = async (
    userId: string,
    postId: string,
    commentId: string,
    type: string
) => {
    console.log('Creating reaction with:', { userId, postId, commentId, type });
    const res = await pool.query(reactionSQL.createReactionSQL,
        [
            userId,
            postId,
            commentId,
            type
        ]
    );
    return res.rows[0];
}

export const updatePostReactionTypeDAL = async (userId: string, postId: string, type: string) => {
    return await pool.query(reactionSQL.updatePostReactionTypeSQL, [userId, postId, type]);
};

export const updateCommentReactionTypeDAL = async (userId: string, commentId: string, type: string) => {
    console.log('Updating comment reaction type with:', { userId, commentId, type });
    return await pool.query(reactionSQL.updateCommentReactionTypeSQL, [userId, commentId, type]);
};

export const deleteReactionDAL = async (id: string) => {
    return await pool.query(reactionSQL.deleteReactionSQL, [id]);
}


