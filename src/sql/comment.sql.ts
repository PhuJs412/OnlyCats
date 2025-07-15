export const getAllCommentByPostIdSQL = `
	select c.id as comment_id,
        u.id as user_id,
		u.username,
		u.avatar_url,
		u.background_url,
        c.post_id,
        c.content,
        c.is_edited,
        c.created_at,
        c.updated_at
    from comments c
    inner join users u on c.user_id = u.id
    where c.post_id = $1
    and c.is_deleted = FALSE
    and c.parent_comment_id is NULL
    order by created_at DESC
`;

export const getCommentByIdSQL = `
    select id as comment_id,
        user_id,
        post_id,
        content,
        is_edited,
        created_at,
        updated_at
    from comments
    where id = $1
    and is_deleted = FALSE
`;

export const getRepliesByCommentIdSQL = `
	select c.id as comment_id,
        c.parent_comment_id,
        u.id as user_id,
		u.username,
		u.avatar_url,
		u.background_url,
        c.post_id,
        c.content,
        c.is_edited,
        c.created_at,
        c.updated_at
    from comments c
    inner join users u on c.user_id = u.id
    where parent_comment_id = $1
    and c.is_deleted = FALSE
    order by created_at DESC
`;

export const getReplyByCommentIdSQL = `
    select id as comment_id,
        user_id,
        post_id,
        parent_comment_id,
        content,
        is_edited,
        created_at,
        updated_at
    from comments
    where id = $1
    and is_deleted = FALSE
`;

export const createCommentSQL = `
    insert into comments (user_id, post_id, content)
        values ($1, $2, $3)
`;

export const createReplySQL = `
    insert into comments (user_id, post_id, content, parent_comment_id)
        values ($1, $2, $3, $4)
`;

export const countCommentByPostIdSQL = `
    select COUNT(*) as total_comment
        from comments
        where post_id = $1
        and is_deleted = FALSE
`;

export const countReplyByCommentIdSQL = `
    select COUNT(*) as total_reply
        from comments
        where parent_comment_id = $1
        and is_deleted = FALSE
`;

export const updateCommentSQL = (keys: string[]): string => {
    const clause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');

    const sql = `
    update comments
        set ${clause}
        where id = $${keys.length + 1}    
    `;
    return sql.trim();
};

export const deleteCommentSQL = `
        update comments
            set is_deleted = TRUE
            where id = $1
`;