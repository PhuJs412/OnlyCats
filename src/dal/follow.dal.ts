import * as sql from '../sql/follow.sql';
import { pool } from '../config/pg.config';

export const getAllFollowerDAL = async (targetUserId: string) => {
    const res = await pool.query(sql.getAllFollowerUserSQL, [targetUserId]);
    return res.rows;
};

export const getAllFollowingUserDAL = async (followerId: string) => {
    const res = await pool.query(sql.getAllFollowingUserSQL, [followerId]);
    return res.rows;
};

export const getFollowByUserIdsDAL = async (followerId: string, targetUserId: string) => {
    const res = await pool.query(sql.getFollowByUserIdsSQL, [followerId, targetUserId]);
    return res.rows[0];
};

export const countFollowerDAL = async (targetUserId: string) => {
    const res = await pool.query(sql.countFollower, [targetUserId]);
    return res.rows[0];
};

export const countFollowingDAL = async (followerId: string) => {

    const res = await pool.query(sql.countFollowing, [followerId]);
    return res.rows[0];
};

export const followUserDAL = async (loginUserId: string, targetUserId: string, status: string) => {
    const res = await pool.query(sql.followUserSQL, [loginUserId, targetUserId, status]);
    return res.rows[0];
};

export const updateFollowStatusDAL = async (loginUserId: string, targetUserId: string, status: string) => {
    const res = await pool.query(sql.updateFollowStatusSQL, [loginUserId, targetUserId, status]);
    return res.rows[0];
};

export const deleteFollowerDAL = async (loginUserId: string, targetUserId: string) => {
    await pool.query(sql.deleteFollowerSQL, [loginUserId, targetUserId]);
};
