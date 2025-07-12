import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); //Thực thi hàm config() của Pool trong pg => để sử dụng cơ chế đọc file .env và lấy giá trị từ đó

export const pool = new Pool({
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 0, // tham số port là 1 number => cần ép kiểu về
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: String( process.env.DB_PASSWORD) || ''
});

export async function testDbConnection(){
    try {
        const res = await pool.query('SELECT NOW()'); //Lấy thời gian hiện tại
        console.log('Connected db successfully at: ', res.rows[0].now);
    } catch (error) {
        console.error('Db connection failed !');
        console.log('Error: ', error);
    }
}