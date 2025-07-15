import * as sql from '../sql/comment.sql';
import { pool } from '../config/pg.config';
import { CommentUpdate } from '../models/comment.update.model';

export const getAllCommentByPostIdDAL = async (post_id: string) => {
    const res = await pool.query(sql.getAllCommentByPostIdSQL, [post_id]);
    return res.rows;
};

export const getCommentByIdDAL = async (comment_id: string) => {
    const res = await pool.query(sql.getCommentByIdSQL, [comment_id]);
    return res.rows[0];
};

export const getRepliesByCommentIdDAL = async (comment_id: string) => {
    const res = await pool.query(sql.getRepliesByCommentIdSQL, [comment_id]);
    return res.rows;
};

export const getReplyByCommentIdDAL = async (comment_id: string) => {
    const res = await pool.query(sql.getReplyByCommentIdSQL, [comment_id]);
    return res.rows;
};

export const countCommentByPostIdDAL = async (post_id: string) => {
    const res = await pool.query(sql.countCommentByPostIdSQL, [post_id]);
    return res.rows;
};

export const countReplyByCommentIdDAL = async (comment_id: string) => {
    const res = await pool.query(sql.countReplyByCommentIdSQL, [comment_id]);
    return res.rows;
};

export const createCommentDAL = async (
    user_id: string,
    post_id: string,
    content: string,
) => {
    const data = [user_id, post_id, content];
    return await pool.query(sql.createCommentSQL, data);
};

export const createReplyDAL = async (
    user_id: string,
    post_id: string,
    content: string,
    parent_comment_id: string // trường hợp trả lời comment thì lấy comment_id của cha và bỏ vào đây
) => {
    const data = [user_id, post_id, content, parent_comment_id];
    return await pool.query(sql.createReplySQL, data);
};

export const updateCommentDAL = async (comment: CommentUpdate, comment_id: string) => {
    const keys = Object.keys(comment);
    const values = Object.values(comment);

    if (keys.length === 0) {
        return;
    }

    const result = sql.updateCommentSQL(keys);
    return await pool.query(result, [...values, comment_id]);
};

export const deleteCommentDAL = async (comment_id: string) => {
    return await pool.query(sql.deleteCommentSQL, [comment_id]);
};