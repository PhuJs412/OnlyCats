export const getNotificationsByUserIdSQL = `
    select n.id as notification_id,
         n.recipient_id,
         n.sender_id,
         u.username as sender_username,
         u.avatar_url,
         u.background_url,
         n.content,
         n.post_id,
         n.comment_id,
         n.follow_id,
         n.is_read
        from notifications n
            left join users u on u.id = n.recipient_id
            left join posts p on p.id = n.post_id
            left join comments c on c.id = n.comment_id
            left join follows f on f.id = n.follow_id
        where n.recipient_id = $1
            and (
                p.id is NOT NULL or 
                c.id is NOT NULL or 
                f.id is NOT NULL
            )
            and n.sender_id is NOT NULL
            and n.recipient_id is NOT NULL
            and n.is_deleted = FALSE
            and (
                u.is_deleted = FALSE or
                p.is_deleted = FALSE or
                c.is_deleted = FALSE or
                f.is_deleted = FALSE
                )
        order by n.created_at DESC
`;

export const countNonReadedNotificationSQL = `
    select COUNT(*) as total_notification 
        from notifications
        where recipient_id = $1
            and sender_id is NOT NULL
            and recipient_id is NOT NULL
            and is_read = FALSE
            and is_deleted = FALSE
`;

export const createNotificationSQL = `
    insert into notifications (
            recipient_id,
            sender_id,
            content,
            post_id,
            comment_id,
            follow_id
            )
        values ($1, $2, $3, $4, $5, $6)
        returning id, created_at
`;

export const updateNotificationStatusSQL = `
    update notifications
        set is_read = TRUE
        where id = $1
`;

export const deleteNotificationSQL = `
    update notifications
        set is_deleted = TRUE
        where id = $1
`;