export const createOTPSQL = `
    insert into otp (email, otp_code, expires_at)
    values ($1, $2, $3)
`;

export const validOTPSQL = `
    select o.id as otp_id,
		u.id as user_id,
		u.username,
        o.email as user_email,
        o.otp_code,
        o.expires_at,
        o.is_used,
        o.created_at
    from otp o
        inner join users u on u.email = o.email 
    where o.email = $1
        and o.otp_code =  $2
        and o.is_used = FALSE
        and o.expires_at > NOW()
`;

export const updateOTPStatusSQL = `
    update otp 
        set is_used = TRUE
        where id = $1
`;