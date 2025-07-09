export const createUserSQL = `
    insert into users (
        username, email, password, gender, dob, avatar_url, background_url
    ) values ($1, $2, $3, $4, $5, $6, $7) 
     returning id, username, email, avatar_url, created_at
     `;

export const getUserByEmailSQL = `
    select * from users 
        where email = $1 
        and is_deleted = fasle
        `;