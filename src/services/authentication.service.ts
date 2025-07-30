import bcrypt from 'bcrypt'; // Thư viện mã hóa password (hash ra để mã hóa từng ký tự)
import jwt from 'jsonwebtoken'; // Thư viện tạo token cho user 
import { createUserDAL, getUserByEmailDAL, saveUserDAL } from '../dal/user.dal';
import { validUserInputPayload, validPasswordValue } from './validate_input_payload.service';
import { ErrorMessage } from '../enums/errorEnums';

import dotenv from 'dotenv';

dotenv.config();

//Register user
export const registerUser = async (body: any): Promise<void> => {
    try {
        const { id, username, email, password, gender, dob, avatar_url, background_url } = body; // lấy ra các field có trong body làm biến ( vừa biến vừa giá trị )

        await validUserInputPayload(id, username, email, gender, dob);
        validPasswordValue(password);

        const encryptedPassword = await bcrypt.hash(password, 10); //hash chuỗi password với độ phức tạp = 10. Vì cần bất đồng bộ để mã hóa => xài await 

        await createUserDAL(username, email, encryptedPassword, gender, dob, avatar_url, background_url);
    } catch (error) {
        console.log(ErrorMessage.REGISTER_ERROR, error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string): Promise<string> => {
    const MAX_FAILED_ATTEMPTS = parseInt(process.env.MAX_FAILED_ATTEMPTS || '5');
    const LOCK_DURATION_MINUTES = parseInt(process.env.LOCK_DURATION_MINUTES || '5');
    const user = await getUserByEmailDAL(email);

    if (!user) throw new Error(ErrorMessage.ACCOUNT_NOT_FOUND);
    const id = user.id;

    // Nếu bị khóa
    if (user.is_locked) {
        const lockedAt = user.locked_at ? new Date(user.locked_at) : null;
        const now = new Date();

        if (lockedAt) {
            const diffMinutes = ((now.getTime() - lockedAt.getTime()) - 7 * 60 * 60 * 1000) / (1000 * 60); // tính giờ từ thời gian hiện tại - lúc bị khóa và công thức đổi sang phút -> 1, 2, 3,... phút
            if (diffMinutes < LOCK_DURATION_MINUTES) {
                throw new Error(`Account is locked. Try again in ${Math.ceil(LOCK_DURATION_MINUTES - diffMinutes)} minute(s).`);
            } else {
                // Hết thời gian khóa → mở lại acc
                await saveUserDAL({
                    is_locked: false,
                    failed_login_attempt: 0,
                    locked_at: null,
                }, id);
            }
        } else {
            throw new Error(ErrorMessage.ACCOUNT_LOCKED);
        }
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const failedCount = (user.failed_login_attempt ?? 0) + 1; // dùng toán tử Nullish Coalescing Operator để tránh ++ cho giá trị bị null hay undefined

        const updateData: any = {
            failed_login_attempt: failedCount,
        };

        // Nếu quá số lần cho phép → bị lock
        if (failedCount >= MAX_FAILED_ATTEMPTS) {
            updateData.is_locked = true;
            updateData.locked_at = new Date().toISOString();
        }

        await saveUserDAL(updateData, id);
        throw new Error(`Invalid password. Attempt ${failedCount}/${MAX_FAILED_ATTEMPTS}`);
    }

    // Thành nhập thành công -> reset lại giá trị lock
    await saveUserDAL({
        failed_login_attempt: 0,
        is_locked: false,
        locked_at: null,
    }, id);

    //Tạo token 
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        {
            expiresIn: '30d',
            algorithm: 'HS256',
            issuer: 'OnlyCats',
            audience: 'OnlyCatsUsers',
            subject: 'UserAuthenticationToken'
        }
    );

    return token;
};