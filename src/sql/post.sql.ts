//Show toàn bộ post của tất cả user -> trang chính 
export const getAllPostSQL = `
    select p.id as post_id, 
		p.content,
        p.shared_post_id,
		u.id as user_id, 
		u.username, 
		u.avatar_url,
		u.background_url,
		p.media_url,
		p.visibility,
		p.is_edited,
		p.created_at,
		p.updated_at
		
	from posts p 
	inner join users u on u.id = p.user_id
        where p.is_deleted = FALSE
		and p.visibility = 'public'
		and u.is_private = FALSE
		and u.is_abandoned = FALSE
		and u.is_deleted = FALSE
    ORDER BY p.created_at DESC
`;

//LOGIN USER
//Khi xem post trong profile của chính mình => Show hết
export const getPostsByMyselfIdSQL = `
    select p.id as post_id, 
		p.content, 
		u.id as user_id, 
		u.username, 
		u.avatar_url,
		u.background_url,
        p.shared_post_id,
		p.media_url,
		p.visibility,
		p.is_edited,
		p.created_at,
		p.updated_at
		
	from posts p 
		inner join users u on u.id = p.user_id
    
    where p.user_id = $1 
    	and u.is_abandoned = FALSE
		and u.is_deleted = FALSE
    	and p.is_deleted = FALSE
    ORDER BY p.created_at DESC
`;

//Show 1 bài viết cụ thể 
export const getMySelfPostByIdSQL = `
    select p.id as post_id, 
		p.content, 
		u.id as user_id, 
		u.username, 
		u.avatar_url,
		u.background_url,
        p.shared_post_id,
		p.media_url,
		p.visibility,
		p.is_edited,
		p.created_at,
		p.updated_at
		
	from posts p 
	inner join users u on u.id = p.user_id
    
    where p.id = $1 
    	and u.is_abandoned = FALSE
		and u.is_deleted = FALSE
    	and p.is_deleted = FALSE
`;
//** END - LOGIN USER **


//FOLLOWER
//Chỉ show bài viết khi user đó có trong danh sách follow 
export const getPostsForFollowerSQL = ` 
    select DISTINCT p.id as post_id, 
		p.content, 
		u.id as user_id, 
		u.username, 
		u.avatar_url,
		u.background_url,
        p.shared_post_id,
		p.media_url,
		p.visibility,
		p.is_edited,
		p.created_at,
		p.updated_at
		
	from posts p 
		inner join users u on u.id = p.user_id
    	inner join follows f on f.following_id = p.user_id
    where f.following_id = $1
    	and u.is_abandoned = FALSE
		and u.is_deleted = FALSE
    	and p.is_deleted = FALSE
    	and p.visibility <> 'private'
		and f.is_deleted = FALSE
    ORDER BY p.created_at DESC
`;

//Show 1 bài viết cụ thể 
export const getPostByFollowerIdSQL = `
	select 
		p.id as post_id,
		p.content,
		u.id as user_id,
		u.username,
		u.avatar_url,
		u.background_url,
		p.shared_post_id,
		p.media_url,
		p.visibility,
		p.is_edited,
		p.created_at,
		p.updated_at

	from posts p
	inner join users u on u.id = p.user_id
	inner join follows f on f.following_id = u.id

	where 
		p.id = $1
		and f.follower_id = $2
		and u.is_abandoned = FALSE
		and u.is_deleted = FALSE
		and p.is_deleted = FALSE
		and p.visibility <> 'private'
		and f.is_deleted = FALSE
`;
//END - FOLLOWER

//GUEST
//Khi xem profile của người khác => chỉ show public post
export const getPostsBySomeoneIdSQL = `
    select p.id as post_id, 
		p.content, 
		u.id as user_id, 
		u.username, 
		u.avatar_url,
		u.background_url,
        p.shared_post_id,
		p.media_url,
		p.visibility,
		p.is_edited,
		p.created_at,
		p.updated_at
		
	from posts p 
		inner join users u on u.id = p.user_id
    
    where p.user_id = $1 
    	and u.is_abandoned = FALSE
		and u.is_deleted = FALSE
    	and p.is_deleted = FALSE
    	and p.visibility = 'public'
    ORDER BY p.created_at DESC
`;

//Show 1 bài viết cụ thể 
export const getSomeonePostByIdSQL = `
    select p.id as post_id, 
		p.content, 
		u.id as user_id, 
		u.username, 
		u.avatar_url,
		u.background_url,
        p.shared_post_id,
		p.media_url,
		p.visibility,
		p.is_edited,
		p.created_at,
		p.updated_at
		
	from posts p 
	inner join users u on u.id = p.user_id
    
    where p.id = $1 
    	and u.is_abandoned = FALSE
		and u.is_deleted = FALSE
    	and p.is_deleted = FALSE
    	and p.visibility = 'public'
`;
//** END - GUEST **

export const countSharedPostByPostIdSQL = `
    select count(*) as total_shared
    from posts p
    inner join users u on u.id = p.user_id
    where p.shared_post_id = $1
      and p.is_deleted = FALSE
      and p.visibility = 'public'
      and u.is_abandoned = FALSE
      and u.is_deleted = FALSE
`;

export const createPost = `
    insert into posts (user_id, content, media_url, visibility)
    values ($1, $2, $3, $4)
	returning id
`;

export const createSharedPost = `
    insert into posts (user_id, shared_post_id, content, visibility)
    values ($1, $2, $3, $4)
	returning id
`;

export const updatePostSQL = (keys: string[]): string => {

	const clause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');

	const sql = `
    update posts
        set ${clause}
        where id = $${keys.length + 1}    
    `;
	return sql.trim();
};

export const deletePostSQL = `
    update posts
        set is_deleted = TRUE
        where id = $1
`;