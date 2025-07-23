import { Request, Response } from "express";
import * as otpService from "../services/otp.service";

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const result = await otpService.requestOTP(email);
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: (error as Error).message });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const result = await otpService.verifyOTP(email, otp);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};