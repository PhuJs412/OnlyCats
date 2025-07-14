import * as userDAL from '../dal/user.dal';
import { UserUpdate } from '../models/user.update.model';
import { Gender } from '../utils/enums';
import { validUserInputPayload } from './validate_input_payload';
import bcrypt from 'bcrypt';

export const getAllUsers = async () => {
    const users = await userDAL.getUsersDAL();
    if (!users || users.length === 0) throw new Error('No account is existed !');
    return users;
};

export const getUserById = async (id: string) => {
    const user = await userDAL.getUserByIdDAL(id);
    if (!user) throw new Error('User not found');
    return user;
};

export const getUserByEmail = async (id: string) => {
    const user = await userDAL.getUserByEmailDAL(id);
    if (!user || user.length === 0) throw new Error('User not existed');
    return user;
};

export const getUserByUsername = async (username: string) => {
    const user = await userDAL.getUserByUsernameDAL(username);
    if (!user || user.length === 0) throw new Error('User not existed');
    return user;
};
export const updateUser = async (user: UserUpdate, id: string) => {
    const { username, email, password, gender, dob} = user;
    if (username && email && password && gender && dob) {
        // Kiểm tra giá trị quan trọng truyền vào có hợp lệ không
        validUserInputPayload(id, username, email, password, gender, dob);
        return await userDAL.saveUserDAL(user, id);
    }
    throw new Error('Wrong data type for input value, please try again');

};

export const updatePassword = async (password: string, id: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userDAL.getUserByIdDAL(id);
    if (!user || user.length === 0) throw new Error('User not found');
    return await userDAL.updatePasswordDAL(hashedPassword, id);
};

export const deleteUser = async (id: string) => {
    const user = await userDAL.getUserByIdDAL(id);
    if (!user || user.length === 0) throw new Error('User not found');
    return await userDAL.deleteUserDAL(id);
};
