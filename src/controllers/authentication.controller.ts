import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/authentication.service';
import { formatResponse } from '../utils/responseFormat';
import { SuccessfulEnums } from '../enums/successfulEnums';

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(formatResponse(200, SuccessfulEnums.USER_REGISTERED, user));
  } catch (err) {
    res.status(400).json(formatResponse(400, (err as Error).message));
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.status(200).json(formatResponse(200, SuccessfulEnums.USER_LOGGED_IN, { token }));
  } catch (err: any) {
    res.status(400).json(formatResponse(400, (err as Error).message));
  }
};
