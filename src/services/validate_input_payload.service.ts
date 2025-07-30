import dayjs from 'dayjs';
import { getUserByEmailDAL, getUserbyUsernameDAL } from '../dal/user.dal';
import { FollowStatus, Gender, Visibility, ReactionType } from '../enums/validInputEnums';
import { ErrorMessage } from '../enums/errorEnums';

// Kiểm tra giá trị đầu vào user
export const validUserInputPayload = async (id: string, username: string, email: string, gender: string, dob: string) => {
    try {

        // Kiểm tra  duplicated username
        const duplicatedUsername = await getUserbyUsernameDAL(username);
        if (duplicatedUsername) {
            throw new Error(ErrorMessage.DUPLICATED_USERNAME);
        }

        // Kiểm tra  duplicated email
        const duplicatedEmail = await getUserByEmailDAL(email);
        if (duplicatedEmail) {
            throw new Error(ErrorMessage.DUPLICATED_EMAIL);
        }

        if (email) {
            // Kiểm tra  input email value
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; //Bắt buộc email phải kết thúc bằng @gmail.com và có phần username hợp lệ.
            if (!gmailRegex.test(email)) {
                throw new Error(ErrorMessage.INVALID_EMAIL_FORMAT);
            }
        }

        // Kiểm tra gender value
        if (gender) {
            const genderEnums = Object.values(Gender) as string[];
            if (!genderEnums.includes(gender.toLowerCase())) {
                throw new Error(ErrorMessage.INVALID_GENDER_INPUT);
            }
        }

        // Kiểm tra dob value
        if (dob) {
            if (!dob && dayjs(dob, 'YYYY-MM-DD', true).isValid()) {
                throw new Error(ErrorMessage.INVALID_DOB_FORMAT);
            }
            // Kiểm tra age value
            const age = dayjs().diff(dayjs(dob), 'year');
            if (age < 13) {
                throw new Error(ErrorMessage.UNDER_AGE);
            }
        }

    } catch (error) {
        console.log(ErrorMessage.ERROR_VALIDATING_INPUT);
        throw error
    }
};

export const validPasswordValue = (password: string) => {
    // Kiểm tra input password value
    if (password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Bắt buộc có: Ít nhất 1 chữ thường ([a-z]), Ít nhất 1 chữ hoa ([A-Z]), Tổng cộng ít nhất 8 ký tự

        if (!passwordRegex.test(password)) {
            throw new Error(ErrorMessage.INVALID_PASSWORD_FORMAT);
        }
    }
}

// Kiểm tra visibility của bài viết
export const validVisibilityStatus = (visibility: string) => {
    const visibilityEnums = Object.values(Visibility) as string[];
    if (!visibilityEnums.includes(visibility)) {
        throw new Error(ErrorMessage.INVALID_VISIBILITY_STATUS);
    }
};

// Kiểm tra status của follow
export const validFollowStatus = (status: string) => {
    const followStatusEnums = Object.values(FollowStatus) as string[];
    if (!followStatusEnums.includes(status)) {
        throw new Error(ErrorMessage.INVALID_FOLLOW_STATUS);
    }
};

// Kiểm tra reaction type
export const validReactionType = (type: string) => {
    const reactionTypeEnums = Object.values(ReactionType) as string[];
    if (!reactionTypeEnums.includes(type)) {
        throw new Error(ErrorMessage.INVALID_REACTION_TYPE);
    }
};