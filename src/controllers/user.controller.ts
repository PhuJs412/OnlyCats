import { Request, Response } from 'express';
import { pool } from '../config/pg.config';

//Get users
export const getUsers = (async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `select ID,
                    USERNAME,
                    BIO,
                    GENDER,
                    DOB,
                    IS_PRIVATE,
                    AVATAR_URL
                    from USERS
                    where IS_PRIVATE = 'false'
                    and IS_ABANDONED = 'false'
                    and IS_VERIFIED = 'true'
             `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ 
            error: 'Server error',
            detail_message: err
        });
    }
});
