import dayjs from 'dayjs';
import { getUserByEmailDAL } from '../dal/user.dal';
import { Gender, Visibility } from '../utils/enums';

export const validUserInputPayload = async (id: string, username: string, email: string, password: string, gender: string, dob: string) => {
    try {
        //Check duplicated email
        const duplicatedEmail = await getUserByEmailDAL(email);
        if (duplicatedEmail) {  //Check trùng email, nếu có rồi thì không đăng ký lại nữa
            throw new Error('Email has existed !');
        }

        //Validate input email value
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; //Bắt buộc email phải kết thúc bằng @gmail.com và có phần username hợp lệ.
        if (!gmailRegex.test(email)) {
            throw new Error('Email must be a valid Gmail address (e.g., example@gmail.com)');
        }

        //Validate input password value
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Bắt buộc có: Ít nhất 1 chữ thường ([a-z]), Ít nhất 1 chữ hoa ([A-Z]), Tổng cộng ít nhất 8 ký tự

        if (!passwordRegex.test(password)) {
            throw new Error('Password must be at least 8 characters and include both uppercase and lowercase letters');
        }

        //Validate gender value
        const genderEnums = Object.values(Gender) as string[];
        if (!genderEnums.includes(gender.toLowerCase())) {
            throw new Error('Gender must be one of: male, female, other');
        }

        //Validate dob value
        if (!dob && dayjs(dob, 'YYYY-MM-DD', true).isValid()) {
            throw new Error('Date of birth must be in YYYY-MM-DD format');
        }

        //Validate age value
        const age = dayjs().diff(dayjs(dob), 'year');
        if (age < 13) {
            throw new Error('You are too young to register');
        }
    } catch (error) {
        console.log("Lỗi khi valid input data");
        throw error
    }
};

export const validVisibilityStatus = async (visibility: string) => {
    const visibilityEnums = Object.values(Visibility) as string[];
    if (visibilityEnums.includes(visibility.toLowerCase())) {
        throw new Error("Visibility must be either 'public' or 'private'.");
    }
};