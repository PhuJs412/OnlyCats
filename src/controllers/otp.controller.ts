import { Request, Response } from "express";
import { formatResponse } from "../utils/responseFormat";
import * as otpService from "../services/otp.service";
import { SuccessfulEnums } from "../utils/successfulEnums";

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await otpService.requestOTP(email);
        res.status(200).json(formatResponse(200, SuccessfulEnums.OTP_SENT));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        await otpService.verifyOTP(email, otp);
        res.status(200).json(formatResponse(200, SuccessfulEnums.OTP_VERIFIED));
    } catch (error) {
        res.status(500).json(formatResponse(500, (error as Error).message));
    }
};