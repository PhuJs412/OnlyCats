import bcrypt from 'bcrypt'; // Thư viện mã hóa password (hash ra để mã hóa từng ký tự)
import jwt from 'jsonwebtoken'; // Thư viện tạo token cho user 
import { createUser, getUserByEmail } from '../dal/user.dal';
import { User } from '../models/user.model';

//Register user
export const registerUser = async (body: any): Promise<User> => {
    try {
        const { username, email, password, gender, dob, avatar_url, background_url } = body; // lấy ra các field có trong body làm biến ( vừa biến vừa giá trị )
        const duplicatedEmail = await getUserByEmail(email); //Check trùng email, nếu có rồi thì không đăng ký lại nữa
        if (duplicatedEmail) {
            throw new Error('Email has existed !');
        }

        const encryptedPassword = await bcrypt.hash(password, 10); //hash chuỗi password với độ phức tạp = 10. Vì cần bất đồng bộ để mã hóa => xài await 
        return await createUser(username, email, encryptedPassword, gender, dob, avatar_url, background_url)
    } catch (error) {
        throw error;
    }
};

//Login user
export const loginUser = async (email: string, password: string): Promise<string> => {
    try {
        const loginAccount = await getUserByEmail(email);
        if (!loginAccount) {
            throw new Error('Account is not existed !');
        }

        const passwordCheck = await bcrypt.compare(password, loginAccount.password); // mã hóa lại hash để kiểm tra password có match với input password không
        if (!passwordCheck) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ id: loginAccount.id, email: loginAccount.email }, process.env.JWT_SECRET!, { expiresIn: '1d' }); //Bắt đầu sign các thông tin cần thiết cho token
        return token;
    } catch (error) {
        throw error;
    }
}