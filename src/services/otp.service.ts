import dayjs from "dayjs";
import * as otpDal from "../dal/otp.dal";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { sendEmail } from "../utils/email";
import { getUserByEmailDAL } from "../dal/user.dal";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "email",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// GENERATE OTP
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // tạo 6 số random 
};

export const requestOTP = async (email: string) => {
    const expireMinutes: number = Number(process.env.EXPIRED_MINUTES) || 0;
    const nowDate: number = Number(Date.now());
    const expiresAt: string = dayjs(String(new Date(nowDate + 1 * 60 * 1000))).format('YYYY-MM-DD HH:mm:ss'); // Thời hạn OTP: 3 phút + format lại date cho đúng giá trị
    const otpCode = generateOTP();
    
    const user = await getUserByEmailDAL(email);
    if(!user) throw new Error('User not found');

    await otpDal.createOTPDAL(email, otpCode, expiresAt);

    // Gửi mail 
    try {
        const subject = 'Your OTP Code';
        const html = `<p>Your OTP code is <strong> ${otpCode} </strong> <italic>(Don't share it to anyone else)</italic>. It will expire in ${expireMinutes} minutes.</p>`;
        await sendEmail(email, subject, html);
        return { message: 'OTP sent successfully' };
    } catch (error) {
        throw new Error('Failed to send OTP email');
    }
};

export const verifyOTP = async (email: string, otp: string) => {
    const otpRecord = await otpDal.validOTPDAL(email, otp);
    if (!otpRecord || otpRecord.length === 0) throw new Error('Invalid or Expired OTP'); // Hết hạn 3 phút || đã nhập thành công => Không dùng được || Không cho xài lại
    await otpDal.updateOTPStatusDAL(otpRecord.otp_id);

    return { message: 'OTP verified successfully' };
}

