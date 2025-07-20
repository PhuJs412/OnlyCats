import { pool } from "../config/pg.config";
import * as sql from "../sql/otp.sql";

export const createOTPDAL = async (email: string, otp: string, expired_at: string) => {
    return await pool.query(sql.createOTPSQL, [email, otp, expired_at]);
}

export const validOTPDAL = async (email: string, otp: string) => {
    const res = await pool.query(sql.validOTPSQL, [email, otp]);
    return res.rows[0];
};

export const updateOTPStatusDAL = async (id: string) => {
    return await pool.query(sql.updateOTPStatusSQL, [id]);
};