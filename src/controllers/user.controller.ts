import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { UserUpdate } from '../models/user.update.model';
import { formatResponse } from '../utils/responseFormat';
import { SuccessfulEnums } from '../enums/successfulEnums';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(formatResponse(200, undefined, users));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(formatResponse(200, undefined, user));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserByEmail(req.params.id);
        res.status(200).json(formatResponse(200, undefined, user));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const searchUserByUsername = async (req: Request, res: Response) => {
    try {
        const user = await userService.searchUserByUsername(req.params.username);
        res.status(200).json(formatResponse(200, undefined, user));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const User: UserUpdate = req.body;
        await userService.updateUser(User, req.params.id);
        res.status(200).json(formatResponse(200, SuccessfulEnums.UPDATE_USER));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        await userService.updatePassword(password, req.params.id);
        res.status(200).json(formatResponse(200, SuccessfulEnums.UPDATE_PASSWORD));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await userService.deleteUser(id);
        res.status(200).json(formatResponse(200, SuccessfulEnums.DELETE_USER));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};