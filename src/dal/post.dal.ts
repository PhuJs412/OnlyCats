import * as sql from '../sql/post.sql';
import { pool } from '../config/pg.config';
import { PostUpdate } from '../models/post.update.model';

export const getAllPostDAL = async () => {
    const res = await pool.query(sql.getAllPostSQL);
    return res.rows;
};

//Login user
export const getPostsByMyselfIdDAL = async (user_id: string) => {
    const res = await pool.query(sql.getPostsByMyselfIdSQL, [user_id]);
    return res.rows;
};

export const getPostByIdDAL = async (id: string) => {
    const res = await pool.query(sql.getMySelfPostByIdSQL, [id]);
    return res.rows[0];
};
// END - login user

//Follower
export const getPostsByFollowerIdDAL = async (user_id: string) => {
    const res = await pool.query(sql.getPostsForFollowerSQL, [user_id]);
    return res.rows;
};

export const getPostByFollowerIdDAL = async (post_id: string, user_id: string) => {
    const res = await pool.query(sql.getPostByFollowerIdSQL, [post_id, user_id]);
    return res.rows[0];
};
// END - follower

// Guest
export const getPostsBySomeoneIdDAL = async (user_id: string) => {
    const res = await pool.query(sql.getPostsBySomeoneIdSQL, [user_id]);
    return res.rows;
}

export const getSomeonePostByIdDAL = async (id: string) => {
    const res = await pool.query(sql.getSomeonePostByIdSQL, [id]);
    return res.rows[0];
};
// END - guest

export const countTotalSharedPostByIdDAL = async (id: string) => {
    return await pool.query(sql.countSharedPostByPostIdSQL, [id]);
};

export const createPostDAL = async (
    user_id: string,
    content: string,
    media_url: string,
    visibility: string
) => {
    const data = [user_id, content, media_url, visibility];
    return await pool.query(sql.createPost, data);
};

export const createSharedPostDAL = async (
    user_id: string,
    shared_post_id: string, // Lấy từ 1 post id cụ thể
    content: string,
    visibility: string
) => {
    const data = [user_id, shared_post_id, content, visibility];
    return await pool.query(sql.createSharedPost, data);
};

export const updatePostDAL = async (post: PostUpdate, id: string) => {
    const keys = Object.keys(post);
    const values = Object.values(post);

    //Trả về nếu không có field gì
    if (keys.length === 0) {
        return;
    }

    // Trả về câu truy vấn
    const result = sql.updatePostSQL(keys);

    //Thực hiện truy vấn, vì tham số không cố định nên giá trị cần bỏ vào ngoặc
    return await pool.query(result, [...values, id]);
};

export const deletePost = async (id: string) => {
    await pool.query(sql.deletePostSQL, [id]);
}