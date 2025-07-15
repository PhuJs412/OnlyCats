export interface Comments {
    id: string;
    user_id: string;
    post_id: string;
    parent_comment_id?: string | null;
    content: string;
    is_edited: boolean;
    is_deleted: boolean;
    created_at: string;   // ISO date string
    updated_at: string;   // ISO date string
};
