export interface PostUpdate {
    id?: string,
    user_id?: string,
    visibility?: string,
    is_deleted?: boolean,

    shared_post_id?: string,
    content?: string,
    media_url?: string,
    is_edited?: boolean,

    updated_at?: string | null;
};