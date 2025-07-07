import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); //Thực thi hàm config() của Pool trong pg => để sử dụng cơ chế đọc file .env và lấy giá trị từ đó

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // tham số port là 1 number => cần ép kiểu về
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});