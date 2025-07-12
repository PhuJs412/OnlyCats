import { pool } from '../config/pg.config';
import { User } from '../models/user.model';
import * as sql from '../sql/user.sql';
import { UserUpdate } from '../models/user.update.model';


export const getUsers = async () => {
    const res = await pool.query(sql.getUsersSQL);
    return res.rows;
};

export const getUserById = async (id: string) => {
    const res = await pool.query(sql.getUserByIdSQL, [id]);
    return res.rows[0];
};

export const getUserByUsername = async (username: string) => {
    const name =`%${username}%`;
    const res = await pool.query(sql.getUserByUsername, [name]);
    return res.rows;
};

export const updatePassword = async (hashedPassword: string, id: string) => {
    return await pool.query(sql.updatePasswordSQL, [hashedPassword, id]);
};

export const createUser = async (
    username: string,
    email: string,
    password: string,
    gender: string,
    dob: string,
    avatarUrl: string,
    backgroundUrl: string

) => {
    const data = [username, email, password, gender, dob, avatarUrl, backgroundUrl];
    const result = await pool.query(sql.createUserSQL, data); // Cần bất đồng bộ vì phải đợi truy vấn xong
};

export const getUserByEmail = async (
    email: string

) => {
    const data = [email];
    const result = await pool.query(sql.getUserByEmailSQL, data);
    return result.rows[0] || null; //Tìm không thấy sẽ trả về null, tránh trả về undefined
};

export const saveUser = async (user: UserUpdate, id: string) => {
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

export const deleteUser = async (id: string) => {
    return await pool.query(sql.deleteUser, [id]);
}