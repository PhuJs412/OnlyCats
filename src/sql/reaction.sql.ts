
// Lấy reaction của 1 user
export const getReactionByUserIdAndTypeSQL = `
    select r.id as reaction_id,
        r.user_id,
        u.username,
        u.avatar_url,
        u.background_url,
        r.type 
    from reactions r
        inner join users u on u.id = r.user_id
    where r.user_id = $1
        and r.type = $2
        and (
            r.is_deleted = 'false' or
            u.is_deleted = 'false'
        )
    order by created_at desc
`;


// POSTS

// Lấy toàn bộ reactions từ 1 bài viết
export const getAllReactionsByPostIdSQL = `
    select r.id as reaction_id,
        r.user_id,
        u.username,
        u.avatar_url,
        u.background_url,
        r.type 
    from reactions r
        inner join users u on u.id = r.user_id
        left join posts p on p.id = r.post_id
        left join comments c on c.id = r.comment_id 
    where r.post_id = $1
        and (
        r.is_deleted = 'false' or
        u.is_deleted = 'false' or
        p.is_deleted = 'false' or
        c.is_deleted = 'false'
        )
    order by created_at desc
`;

// Lấy toàn bộ reactions từ 1 bài viết theo type
export const getAllReactionsByPostIdAndTypeSQL = `
    select r.id as reaction_id,
        r.user_id,
        u.username,
        u.avatar_url,
        u.background_url,
        r.type 
    from reactions r
        inner join users u on u.id = r.user_id
        left join posts p on p.id = r.post_id
        left join comments c on c.id = r.comment_id 
    where r.post_id = $1
        and r.type = $2
        and (
        r.is_deleted = 'false' or
        u.is_deleted = 'false' or
        p.is_deleted = 'false' or
        c.is_deleted = 'false'
        )
    order by created_at desc
`;

// Đếm tổng số reactions của 1 bài viết
export const countReactionsByPostIdSQL = `
    select COUNT(*) as total_reactions
    from reactions r
        inner join users u on u.id = r.user_id
        left join posts p on p.id = r.post_id
        left join comments c on c.id = r.comment_id 
    where post_id = $1
        and is_deleted = 'false'
        and (
        r.is_deleted = 'false' or
        u.is_deleted = 'false' or
        p.is_deleted = 'false' or
        c.is_deleted = 'false'
        )
`;

// Đếm tổng số reactions của 1 bài viết theo type
export const countReactionsByPostIdAndTypeSQL = `
    select COUNT(*) as total_reactions
    from reactions r
        inner join users u on u.id = r.user_id
        left join posts p on p.id = r.post_id
        left join comments c on c.id = r.comment_id 
    where post_id = $1
        and type = $2
        and is_deleted = 'false'
        and (
        r.is_deleted = 'false' or
        u.is_deleted = 'false' or
        p.is_deleted = 'false' or
        c.is_deleted = 'false'
        )
`;
// ** END - POSTS **


// REACTIONS
// Lấy toàn bộ reactions từ 1 comment
export const getAllReactionsByCommentIdSQL = `
    select r.id as reaction_id,
        r.user_id,
        u.username,
        u.avatar_url,
        u.background_url,
        r.type 
    from reactions r
        inner join users u on u.id = r.user_id
        left join posts p on p.id = r.post_id
        left join comments c on c.id = r.comment_id 
    where r.comment_id = $1
        and (
        r.is_deleted = 'false' or
        u.is_deleted = 'false' or
        p.is_deleted = 'false' or
        c.is_deleted = 'false'
        )
    order by created_at desc
`;

// Lấy toàn bộ reactions từ 1 comment theo type
export const getAllReactionsByCommentIdAndTypeSQL = `
    select r.id as reaction_id,
        r.user_id,
        u.username,
        u.avatar_url,
        u.background_url,
        r.type 
    from reactions r
        inner join users u on u.id = r.user_id
        left join posts p on p.id = r.post_id
        left join comments c on c.id = r.comment_id 
    where r.comment_id = $1
        and r.type = $2
        and (
        r.is_deleted = 'false' or
        u.is_deleted = 'false' or
        p.is_deleted = 'false' or
        c.is_deleted = 'false'
        )
    order by created_at desc
`;

// Đếm tổng số reactions của 1 comment
export const countReactionsByCommentIdSQL = `
    select COUNT(*) as total_reactions
    from reactions r
        inner join users u on u.id = r.user_id
        left join posts p on p.id = r.post_id
        left join comments c on c.id = r.comment_id 
    where comment_id = $1
        and is_deleted = 'false'
        and (
        r.is_deleted = 'false' or
        u.is_deleted = 'false' or
        p.is_deleted = 'false' or
        c.is_deleted = 'false'
        )
`;

// Đếm tổng số reactions của 1 comment theo type
export const countReactionsByCommentIdAndTypeSQL = `
    select COUNT(*) as total_reactions
    from reactions r
        inner join users u on u.id = r.user_id
        left join posts p on p.id = r.post_id
        left join comments c on c.id = r.comment_id 
    where comment_id = $1
        and type = $2
        and is_deleted = 'false'
        and (
        r.is_deleted = 'false' or
        u.is_deleted = 'false' or
        p.is_deleted = 'false' or
        c.is_deleted = 'false'
        )
`;
// ** END - REACTIONS **


export const createReactionSQL = `
    insert into reactions (
            user_id,
            post_id,
            comment_id,
            type
            )
        values ($1, $2, $3, $4)
        returning id
`;

export const deleteReactionSQL = `
    update reactions
        set is_deleted = 'true'
        where id = $1
`;