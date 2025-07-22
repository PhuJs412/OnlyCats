import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { UserUpdate } from '../models/user.update.model';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserByEmail(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

export const searchUserByUsername = async (req: Request, res: Response) => {
    try {
        const user = await userService.searchUserByUsername(req.params.username);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const User: UserUpdate = req.body;
        await userService.updateUser(User, req.params.id);
        res.status(200).json('updated user successfully !');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        await userService.updatePassword(password, req.params.id);
        res.status(200).json('updated user successfully !');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await userService.deleteUser(id);
        res.status(200).json('deleted user successfully !');
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};