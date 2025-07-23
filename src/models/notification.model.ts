export interface Notification {
    id?: string | null,
    recipient_id?: string | undefined,
    sender_id?: string,
    content?: string,
    post_id?: string,
    comment_id?: string,
    follow_id?: string,
    is_read?: string,
    is_deleted?: string,
    created_at?: string
};