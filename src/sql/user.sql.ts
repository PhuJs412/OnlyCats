export const getUsersSQL = `
    select * from users 
        where is_deleted = FALSE
        and is_abandoned = FALSE      
`;

export const getUserByIdSQL = `
    select * from users
        where id = $1    
        and is_deleted = FALSE
        and is_abandoned = FALSE 
`;
export const getUserByEmailSQL = `
    select * from users 
        where email = $1 
        and is_deleted = FALSE
        and is_abandoned = FALSE 
        `;

export const getUserByUsername = `
    select * from users
        where username LIKE $1
        and is_deleted = FALSE
        and is_abandoned = FALSE 
`;

export const createUserSQL = `
    insert into users (
        username, email, password, gender, dob, avatar_url, background_url
    ) values ($1, $2, $3, $4, $5, $6, $7) 
     `;

export const updatePasswordSQL = `
    update users
        set password = $1
        where id = $2
`;

export const updateUserSQL = (keys: string[]): string => {
    //Dựng clause để lấy các field và value cần set 
    //Sau khi map -> clause là 1 mảng mới chứa các phần tử cần update
    const clause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');

    // id → sẽ là tham số cuối cùng, nên($fields.length + 1)
    const sql = `
        update users
            set ${clause}
            where id = $${keys.length + 1};
            `;
    return sql.trim();
};

export const deleteUser = `
    update users
        set is_deleted = TRUE
        where id = $1
`;
