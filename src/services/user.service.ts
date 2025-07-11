import * as userDAL from '../dal/user.dal';
import { UserUpdate } from '../models/user.update.model';
import bcrypt from 'bcrypt';

export const getAllUsers = async () => {
    const users = await userDAL.getUsers();
    if (!users) throw new Error('No account is existed !');
    return users;
};

export const getUserById = async (id: string) => {
    const user = await userDAL.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
};

export const getUserByEmail = async (id: string) => {
    const user = await userDAL.getUserByEmail(id);
    if (!user) throw new Error('User not existed');
    return user;
};


export const updateUser = async (user: UserUpdate, id: string) => {
    return await userDAL.saveUser(user, id);
};

export const updateAvatar = async (avatarUrl: string, id: string) => {
    return await userDAL.updateAvatar(avatarUrl, id);
};

export const updatePassword = async (password: string, id: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await userDAL.updatePassword(hashedPassword, id);
};
