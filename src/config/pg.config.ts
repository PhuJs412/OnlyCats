import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({

    //DÀNH CHO KẾT NỐI TỪ NEON (DB CLOUD)
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },

    //DÀNH CHO KẾT NỐI THỦ CÔNG

    // host: process.env.DB_HOST || '',
    // port: Number(process.env.DB_PORT) || 0,
    // database: process.env.DB_NAME || '',
    // user: process.env.DB_USER || '',
    // password: String(process.env.DB_PASSWORD) || ''
});

export async function testDbConnection() {
    try {
        const time = await pool.query('SELECT NOW()');
        console.log('Connected db successfully at: ', time.rows[0].now);
    } catch (error) {
        console.error('Db connection failed !');
        console.log('Error: ', error);
    }
}