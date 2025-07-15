export interface CommentUpdate {
    id?: string;
    userId?: string;
    postId?: string;
    parent_comment_id?: string | null;
    content: string;
    is_edited: boolean;
    is_deleted: boolean;
    updated_at: string;   // ISO date string
};
