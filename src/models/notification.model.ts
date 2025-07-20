export interface Notification {
    id: string,
    recipient_id: string,
    sender_id: string,
    content: string,
    
    post_id?: string,
    comment_id?: string,
    follow_id?: string,
    is_read?: string,
    is_deleted?: string,
    created_at?: string
};