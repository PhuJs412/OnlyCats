import dayjs from 'dayjs';
import { getUserByEmailDAL, getUserbyUsernameDAL } from '../dal/user.dal';
import { FollowStatus, Gender, Visibility, ReactionType } from '../utils/enums';

// Kiểm tra giá trị đầu vào user
export const validUserInputPayload = async (id: string, username: string, email: string, gender: string, dob: string) => {
    try {

        // Kiểm tra  duplicated username
        const duplicatedUsername = await getUserbyUsernameDAL(username);
        if (duplicatedUsername) {
            throw new Error('Username has existed !');
        }

        // Kiểm tra  duplicated email
        const duplicatedEmail = await getUserByEmailDAL(email);
        if (duplicatedEmail) {
            throw new Error('Email has existed !');
        }

        if (email) {
            // Kiểm tra  input email value
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; //Bắt buộc email phải kết thúc bằng @gmail.com và có phần username hợp lệ.
            if (!gmailRegex.test(email)) {
                throw new Error('Email must be a valid Gmail address (e.g., example@gmail.com)');
            }
        }

        // Kiểm tra gender value
        if (gender) {
            const genderEnums = Object.values(Gender) as string[];
            if (!genderEnums.includes(gender.toLowerCase())) {
                throw new Error('Gender must be one of: male, female, other');
            }
        }

        // Kiểm tra dob value
        if (dob) {
            if (!dob && dayjs(dob, 'YYYY-MM-DD', true).isValid()) {
                throw new Error('Date of birth must be in YYYY-MM-DD format');
            }
            // Kiểm tra age value
            const age = dayjs().diff(dayjs(dob), 'year');
            if (age < 13) {
                throw new Error('You are too young to register');
            }
        }

    } catch (error) {
        console.log("Have error when input data");
        throw error
    }
};

export const validPasswordValue = (password: string) => {
    // Kiểm tra input password value
    if (password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Bắt buộc có: Ít nhất 1 chữ thường ([a-z]), Ít nhất 1 chữ hoa ([A-Z]), Tổng cộng ít nhất 8 ký tự

        if (!passwordRegex.test(password)) {
            throw new Error('Password must be at least 8 characters and include both uppercase and lowercase letters');
        }
    }
}

// Kiểm tra visibility của bài viết
export const validVisibilityStatus = (visibility: string) => {
    const visibilityEnums = Object.values(Visibility) as string[];
    if (!visibilityEnums.includes(visibility)) {
        throw new Error("Visibility must be 'public' or 'private' or 'follower_only'.");
    }
};

// Kiểm tra status của follow
export const validFollowStatus = (status: string) => {
    const followStatusEnums = Object.values(FollowStatus) as string[];
    if (!followStatusEnums.includes(status)) {
        throw new Error("Follow status must be 'PENDING' or 'ACCEPTED' or 'APPROVED' or 'CANCELED'.");
    }
};

// Kiểm tra reaction type
export const validReactionType = (type: string) => {
    const reactionTypeEnums = Object.values(ReactionType) as string[];
    if (!reactionTypeEnums.includes(type)) {
        throw new Error("Reaction type must be 'like' or 'haha' or 'love' or 'sad' or 'angry' or 'wow' or 'care'.");
    }
};