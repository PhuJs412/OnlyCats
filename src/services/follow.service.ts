import * as followDal from '../dal/follow.dal';
import { validFollowStatus } from '../services/validate_input_payload.service';
import * as userDal from '../dal/user.dal';

export const getAllFollowerUser = async (targetUserId: string) => {
    const followerUser = await followDal.getAllFollowerDAL(targetUserId);
    return followerUser;
};

export const getAllFollowingUser = async (followerId: string) => {
    const followingUser = await followDal.getAllFollowingUserDAL(followerId);
    return followingUser;
};

export const countFollower = async (targetUserId: string) => {
    const followerUserCount = await followDal.countFollowerDAL(targetUserId);
    return followerUserCount;
};

export const countFollowing = async (followerId: string) => {
    const followingUserCount = await followDal.countFollowingDAL(followerId);
    return followingUserCount;
};

export const followUser = async (loginUserId: string, targetUserId: string) => {
    const existingFollow = await followDal.getFollowByUserIdsDAL(loginUserId, targetUserId);

    // Kiểm tra đã tồn tại record hay chưa
    if (!existingFollow) {
        const targetUser = await userDal.getUserByIdDAL(targetUserId); // Lấy user để kiểm tra có phải private hay public
        const followStatus = targetUser.isPrivate ? 'PENDING' : 'ACCEPTED'; // Nếu user là private => follow ở trạng thái chờ và ngược lại

        validFollowStatus(followStatus);
        await followDal.followUserDAL(loginUserId, targetUserId, followStatus);
        return;
    }

    if (existingFollow.isDeleted || existingFollow.status === 'CANCELED') {
        const targetUser = await userDal.getUserByIdDAL(targetUserId);
        const followStatus = targetUser.isPrivate ? 'PENDING' : 'ACCEPTED';

        validFollowStatus(followStatus);
        await followDal.updateFollowStatusDAL(loginUserId, targetUserId, followStatus);
        return;
    }

    throw new Error('You was follow this user before!');
};

export const updateFollowStatus = async (loginUserId: string, targetUserId: string, followStatus: string) => {
    validFollowStatus(followStatus);
    return await followDal.updateFollowStatusDAL(loginUserId, targetUserId, followStatus);
};

export const deleteUser = async (loginUserId: string, targetUserId: string) => {
    return await followDal.deleteUserDAL(loginUserId, targetUserId);
};