import * as userDAL from '../dal/user.dal';
import { UserUpdate } from '../models/user.update.model';
import { validUserInputPayload, validPasswordValue } from './validate_input_payload.service';
import bcrypt from 'bcrypt';
import { ErrorMessage } from '../enums/errorEnums';

export const getAllUsers = async () => {
    const users = await userDAL.getUsersDAL();
    if (!users || users.length === 0) throw new Error(ErrorMessage.USER_NOT_FOUND);
    return users;
};

export const getUserById = async (id: string) => {
    const user = await userDAL.getUserByIdDAL(id);
    if (!user || user.length === 0) throw new Error(ErrorMessage.USER_NOT_FOUND);
    return user;
};

export const getUserByEmail = async (id: string) => {
    const user = await userDAL.getUserByEmailDAL(id);
    if (!user || user.length === 0) throw new Error(ErrorMessage.USER_NOT_FOUND);
    return user;
};

export const searchUserByUsername = async (username: string) => {
    const user = await userDAL.searchUsernameDAL(username);
    if (!user || user.length === 0) throw new Error(ErrorMessage.USER_NOT_FOUND);
    return user;
};

export const updateUser = async (user: UserUpdate, id: string) => {
    const { username, email, gender, dob } = user;
    const userDatatype: string = username ?? ''; // Nếu username là null || undefined => set chuỗi rỗng
    const emailDatatype: string = email ?? '';
    const genderDatatype: string = gender ?? '';
    const dobDatatype: string = dob ?? '';

    // Kiểm tra giá trị quan trọng truyền vào có hợp lệ không
    await validUserInputPayload(id, userDatatype, emailDatatype, genderDatatype, dobDatatype);

    if (user.password) {
        throw new Error(ErrorMessage.NOT_ALLOWED_PASSWORD_HERE);
    }
    return await userDAL.saveUserDAL(user, id);
};

export const updatePassword = async (password: string, id: string) => {
    validPasswordValue(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userDAL.getUserByIdDAL(id);
    if (!user || user.length === 0) throw new Error(ErrorMessage.USER_NOT_FOUND);
    return await userDAL.updatePasswordDAL(hashedPassword, id);
};

export const deleteUser = async (id: string) => {
    const user = await userDAL.getUserByIdDAL(id);
    if (!user || user.length === 0) throw new Error(ErrorMessage.USER_NOT_FOUND);
    return await userDAL.deleteUserDAL(id);
};
