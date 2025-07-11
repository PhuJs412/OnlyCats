import bcrypt from 'bcrypt'; // Thư viện mã hóa password (hash ra để mã hóa từng ký tự)
import jwt from 'jsonwebtoken'; // Thư viện tạo token cho user 
import { createUser, getUserByEmail, saveUser } from '../dal/user.dal';

import dotenv from 'dotenv';

dotenv.config();

let userObj: any = {};

let token: string = '';

//Register user
export const registerUser = async (body: any): Promise<string> => {
    try {
        const {id, username, email, password, gender, dob, avatar_url, background_url } = body; // lấy ra các field có trong body làm biến ( vừa biến vừa giá trị )
        const duplicatedEmail = await getUserByEmail(email);

        if (duplicatedEmail) {  //Check trùng email, nếu có rồi thì không đăng ký lại nữa
            throw new Error('Email has existed !');
        }

        const encryptedPassword = await bcrypt.hash(password, 10); //hash chuỗi password với độ phức tạp = 10. Vì cần bất đồng bộ để mã hóa => xài await 

        await createUser(username, email, encryptedPassword, gender, dob, avatar_url, background_url);
        return 'Ok';
    } catch (error) {
        console.log("Lỗi đăng ký");
        throw error;
    }
};

export const loginUser = async (email: string, password: string): Promise<string> => {
    const MAX_FAILED_ATTEMPTS = parseInt(process.env.MAX_FAILED_ATTEMPTS || '5');
    const LOCK_DURATION_MINUTES = parseInt(process.env.LOCK_DURATION_MINUTES || '5');

    const user = await getUserByEmail(email);
    const id = user.id;
    if (!user) throw new Error('Account does not exist!');

    // Nếu bị khóa
    if (user.is_locked) {
        const lockedAt = user.locked_at ? new Date(user.locked_at) : null;
        const now = new Date();

        if (lockedAt) {
            const diffMinutes = ((now.getTime() - lockedAt.getTime()) - 7 * 60 * 60 * 1000) / (1000 * 60); // tính giờ từ  thời gian hiện tại - lúc bị khóa và công thức đổi sang phút -> 1, 2, 3,... phút
            console.log(diffMinutes);
            if (diffMinutes < LOCK_DURATION_MINUTES) {
                console.log('true');
                throw new Error(`Account is locked. Try again in ${Math.ceil(LOCK_DURATION_MINUTES - diffMinutes)} minute(s).`);
            } else {
                console.log('true unlock');
                // Hết thời gian khóa → mở lại acc
                await saveUser({
                    is_locked: false,
                    failed_login_attempt: 0,
                    locked_at: null,
                }, id);
            }
        } else {
            throw new Error('Account is locked.');
        }
    }

    // Lấy lại user sau khi có thể đã mở khóa
    const refreshedUser = await getUserByEmail(email);
    if (!refreshedUser) throw new Error('Error reloading user');

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, refreshedUser.password);
    if (!isMatch) {
        const failedCount = (refreshedUser.failed_login_attempt ?? 0) + 1; // dùng toán tử Nullish Coalescing Operator để tránh ++ cho giá trị bị null hay undefined

        const updateData: any = {
            failed_login_attempt: failedCount,
        };

        // Nếu quá số lần cho phép → bị lock
        if (failedCount >= MAX_FAILED_ATTEMPTS) {
            updateData.is_locked = true;
            updateData.locked_at = new Date().toISOString();
        }

        await saveUser(updateData, id);
        throw new Error(`Invalid password. Attempt ${failedCount}/${MAX_FAILED_ATTEMPTS}`);
    }

    // Thành nhập thành công -> reset lại giá trị lock
    await saveUser({
        failed_login_attempt: 0,
        is_locked: false,
        locked_at: null,
    }, id);

    //Tạo token 
    const token = jwt.sign(
        { id: refreshedUser.id, email: refreshedUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: '30d' }
    );

    return token;
};

