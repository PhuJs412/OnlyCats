import * as userDAL from '../dal/user.dal';
import { UserUpdate } from '../models/user.update.model';
import bcrypt from 'bcrypt';

export const getAllUsers = async () => {
    const users = await userDAL.getUsers();
    if (!users || users.length === 0) throw new Error('No account is existed !');
    return users;
};

export const getUserById = async (id: string) => {
    const user = await userDAL.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
};

export const getUserByEmail = async (id: string) => {
    const user = await userDAL.getUserByEmail(id);
    if (!user || user.length === 0) throw new Error('User not existed');
    return user;
};

export const getUserByUsername = async (username: string) => {
    const user = await userDAL.getUserByUsername(username);
    if (!user || user.length === 0) throw new Error('User not existed');
    return user;
};
export const updateUser = async (user: UserUpdate, id: string) => {
    return await userDAL.saveUser(user, id);
};

export const updatePassword = async (password: string, id: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userDAL.getUserById(id);
    if (!user || user.length === 0) throw new Error('User not found');
    return await userDAL.updatePassword(hashedPassword, id);
};

export const deleteUser = async (id: string) => {
    const user = await userDAL.getUserById(id);
    if (!user || user.length === 0) throw new Error('User not found');
    return await userDAL.deleteUser(id);
};
