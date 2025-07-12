import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/authentication.service';

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};
