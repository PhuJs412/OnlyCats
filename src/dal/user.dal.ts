import { pool } from '../config/pg.config';
import * as sql from '../sql/user.sql';
import { UserUpdate } from '../models/user.update.model';
import { User } from '../models/user.model';

export const getUsersDAL = async () => {
    const res = await pool.query(sql.getUsersSQL);
    return res.rows;
};

export const getUserByIdDAL = async (id: string) => {
    const res = await pool.query(sql.getUserByIdSQL, [id]);
    return res.rows[0];
};

export const getUserbyUsernameDAL = async (username: string) => {
    const res = await pool.query(sql.getUserByUsernameSQL, [username]);
    return res.rows[0];
};

export const searchUsernameDAL = async (username: string) => {
    const name = `%${username}%`;
    const res = await pool.query(sql.searchUserByUsername, [name]);
    return res.rows;
};

export const updatePasswordDAL = async (hashedPassword: string, id: string) => {
    return await pool.query(sql.updatePasswordSQL, [hashedPassword, id]);
};

export const createUserDAL = async (
    username: string,
    email: string,
    password: string,
    gender: string,
    dob: string,
    avatarUrl: string,
    backgroundUrl: string

) => {
    const data = [username, email, password, gender, dob, avatarUrl, backgroundUrl];
    await pool.query(sql.createUserSQL, data);
};

export const getUserByEmailDAL = async (
    email: string
) => {
    const data = [email];
    const result = await pool.query(sql.getUserByEmailSQL, data);
    return result.rows[0] || null; //Tìm không thấy sẽ trả về null, tránh trả về undefined
};

export const saveUserDAL = async (user: UserUpdate, id: string) => {
    const keys = Object.keys(user);
    const values = Object.values(user);

    //Trả về nếu không có field gì
    if (keys.length === 0) {
        return;
    }

    // Trả về câu truy vấn
    const result = sql.updateUserSQL(keys);

    //Thực hiện truy vấn, vì tham số không cố định nên giá trị cần bỏ vào ngoặc
    return await pool.query(result, [...values, id]);
};

export const deleteUserDAL = async (id: string) => {
    return await pool.query(sql.deleteUser, [id]);
}