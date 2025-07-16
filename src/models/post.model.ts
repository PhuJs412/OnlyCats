export interface Post {
    id: string,
    user_id: string,
    visibility: string,
    is_deleted: boolean,

    shared_post_id?: string,
    content?: string,
    media_url?: string,
    is_edited?: boolean,

    created_at?: string | null;
    updated_at?: string | null;
};