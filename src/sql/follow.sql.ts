// Lấy danh sách những người mà user đó đang theo dõi
export const getAllFollowingUserSQL = `
    select f.id as follow_id,
        u.id as user_id,
        u.username,
        u.is_private,
        u.avatar_url,
        u.background_url,
        f.status
    from follows f
            inner join users u on f.following_id = u.id
    where f.follower_id = $1
    and f.status = 'ACCEPTED'
    and f.is_deleted = FALSE
    and u.is_deleted = FALSE
    and u.is_abandoned = FALSE
    order by f.created_at DESC
`;

// Lấy danh sách những người đang theo dõi user đó
export const getAllFollowerUserSQL = `
    select f.id as follow_id,
        u.id as user_id,
        u.username,
        u.is_private,
        u.avatar_url,
        u.background_url,
        f.status
    from follows f
            inner join users u on f.follower_id = u.id
    where f.following_id = $1
    and f.status = 'ACCEPTED'
    and f.is_deleted = FALSE
    and u.is_deleted = FALSE
    and u.is_abandoned = FALSE
    order by f.created_at DESC
`;

// Lấy ra 1 bản ghi theo follower_id và following_id
export const getFollowByUserIdsSQL = `
    select f.id as follow_id,
        f.follower_id,
        f.following_id,
        f.is_deleted,
        f.status       
    from follows f 
        inner join users u on f.following_id = u.id
    where f.follower_id = $1
        and f.following_id = $2
        and u.is_deleted = FALSE
        and u.is_abandoned = FALSE
`;

// Đếm lượng số người đang follow user đó
export const countFollower = `
	select COUNT(*) as total_follower
        from follows f
		inner join users u on u.id = f.following_id
	where f.following_id = $1
        and f.status = 'ACCEPTED'
        and f.is_deleted = FALSE
        and u.is_deleted = FALSE
        and u.is_abandoned = FALSE
`;

// Đếm lượng số người mà user đó đang follow
export const countFollowing = `
	select COUNT(*) as total_following
        from follows f
		inner join users u on u.id = f.follower_id
	where f.follower_id = $1
        and f.status = 'ACCEPTED'
        and f.is_deleted = FALSE
        and u.is_deleted = FALSE
        and u.is_abandoned = FALSE
`;

// Thực hiện follow 1 user
export const followUserSQL = `
    insert into follows (follower_id, following_id, status)
        values ($1, $2, $3)
        returning id
`;

// Cập nhật lại trạng thái cho follow
export const updateFollowStatusSQL = `
    update follows
        set status = $3, updated_at = CURRENT_TIMESTAMP
        where follower_id = $1
            and following_id = $2
    returning id
`;

// Xóa mềm của follow - unfollow user đó
export const deleteFollowerSQL = `
    update follows
        set is_deleted = TRUE,
            status = 'CANCELLED',
            updated_at = CURRENT_TIMESTAMP
        where follower_id = $1
            and following_id = $2
`;