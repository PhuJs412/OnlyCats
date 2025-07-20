import { pool } from "../config/pg.config";
import { Notification } from "../models/notification.model";
import * as notificationSQL from "../sql/notification.sql";

export const getNotificationsByUserIdDAL = async (recipient_id: string) => {
    const res = await pool.query(notificationSQL.getNotificationsByUserIdSQL, [recipient_id]);
    return res.rows;
};

export const countNonReadedNotificationDAL = async (recipient_id: string) => {
    const res = await pool.query(notificationSQL.countNonReadedNotificationSQL, [recipient_id]);
    return res.rows[0];
};

export const createNotificationDAL = async (
    recipient_id: string,
    sender_id: string,
    content: string,
    post_id: string | null | undefined,
    comment_id: string | null | undefined,
    follow_id: string | null | undefined
) => {
    return await pool.query(notificationSQL.createNotificationSQL,
        [
            recipient_id,
            sender_id, content,
            post_id ?? null,
            comment_id ?? null,
            follow_id ?? null
        ]
    ); // chuyển thành null đối với id không được truyền giá trị
};

export const updateNotificationStatusDAL = async (notification_id: string) => {
    return await pool.query(notificationSQL.updateNotificationStatusSQL, [notification_id]);
};

export const deleteNotificationDAL = async (notification_id: string) => {
    return await pool.query(notificationSQL.deleteNotificationSQL, [notification_id]);
};