import { pool } from '../config/pg.config';
import { User } from '../models/user.model';
import { createUserSQL, getUserByEmailSQL } from '../sql/user.sql';

// Tạo user 
export const createUser = async (
    username: string, 
    email: string, 
    password: string,
    gender: string, 
    dob: string, 
    avatarUrl: string,
    backgroundUrl: string

): Promise<User> => { // Vì sử dụng async / await nên đối tượng hàm này trả sẽ là Promise. Đồng thời add kiểu dữ liệu cho đối tượng là 1 User ( là 1 model để định hình các field trước khi truyền xuống DB)
    const data = [username, email, password, gender, dob, avatarUrl, backgroundUrl];
    const result = await pool.query(createUserSQL, data); // Cần bất đồng bộ vì phải đợi truy vấn xong
    return result.rows[0]; //Trả về đối tượng đầu tiên được tìm thấy sau truy vấn
};

// Lấy user theo email
export const getUserByEmail = async (
    email: string

): Promise<User> => {
    const data = [email];
    const result = await pool.query(getUserByEmailSQL, data);
    return result.rows[0] || null; //Tìm không thấy sẽ trả về null, tránh trả về undefined
};