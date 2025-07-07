import app from './app';
import { pool } from './config/pg.config';

const PORT = process.env.DB_PORT || 6368;

app.listen(PORT, async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('DB has been connected successfully !');
        console.log(`OnlyCat_API is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Cannot connect to DB');
        console.log('Error message: ', error);
    }
});