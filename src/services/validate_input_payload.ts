import dayjs from 'dayjs';
import { getUserByEmailDAL, getUserByIdDAL } from '../dal/user.dal';
import { Gender, Visibility } from '../utils/enums';
import { PassThrough } from 'stream';

export const validUserInputPayload = async (id: string, username: string, email: string, gender: string, dob: string) => {
    try {

        //Check duplicated email
        if (email) {
            //Validate input email value
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; //Bắt buộc email phải kết thúc bằng @gmail.com và có phần username hợp lệ.
            if (!gmailRegex.test(email)) {
                throw new Error('Email must be a valid Gmail address (e.g., example@gmail.com)');
            }
        }

        //Validate gender value
        if (gender) {
            const genderEnums = Object.values(Gender) as string[];
            if (!genderEnums.includes(gender.toLowerCase())) {
                throw new Error('Gender must be one of: male, female, other');
            }

        }

        //Validate dob value
        if (dob) {
            if (!dob && dayjs(dob, 'YYYY-MM-DD', true).isValid()) {
                throw new Error('Date of birth must be in YYYY-MM-DD format');
            }
            //Validate age value
            const age = dayjs().diff(dayjs(dob), 'year');
            if (age < 13) {
                throw new Error('You are too young to register');
            }
        }

    } catch (error) {
        console.log("Lỗi khi valid input data");
        throw error
    }
};

export const validPasswordValue = (password: string) => {
    //Validate input password value
    if (password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Bắt buộc có: Ít nhất 1 chữ thường ([a-z]), Ít nhất 1 chữ hoa ([A-Z]), Tổng cộng ít nhất 8 ký tự

        if (!passwordRegex.test(password)) {
            throw new Error('Password must be at least 8 characters and include both uppercase and lowercase letters');
        }
    }
}

export const validVisibilityStatus = async (visibility: string) => {
    const visibilityEnums = Object.values(Visibility) as string[];
    if (!visibilityEnums.includes(visibility)) {
        throw new Error("Visibility must be either 'public' or 'private' or 'follower_only'.");
    }
};