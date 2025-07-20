import * as otpController from "../controllers/otp.controller";
import { Router } from "express";

const router = Router();

router.post('/send-otp', otpController.sendOTP);
router.post('/verify-otp', otpController.verifyOTP);

export default router;