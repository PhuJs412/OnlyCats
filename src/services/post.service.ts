import dayjs from 'dayjs';
import * as postDal from '../dal/post.dal';
import { getUserByIdDAL } from '../dal/user.dal';
import { getFollowByUserIdsDAL, getAllFollowerDAL } from '../dal/follow.dal';
import { validVisibilityStatus } from './validate_input_payload.service';
import { deleteAllComment } from './comment.service';
import { createNotification } from './notification.service';
import { generateNotificationContent } from './notification.service';
import { NotificationType } from '../enums/validInputEnums';
import { getIO } from '../socket/socket';
import { Post } from '../models/post.model';
import { Follows } from '../models/follow.model';
import { ErrorMessage } from '../enums/errorEnums';
import { FollowStatus } from '../enums/validInputEnums';
import { Visibility } from '../enums/validInputEnums';

export const getAllPost = async () => {
    const posts = await postDal.getAllPostDAL();
    if (!posts || posts.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
    return posts;
};

//Lấy danh sách bài viết theo user id
export const getPostsByUserId = async (loginUserId: string, user_id: string) => {
    const followObj: Follows = await getFollowByUserIdsDAL(loginUserId, user_id);

    const userObj = await getUserByIdDAL(user_id);
    if (!userObj) throw new Error(ErrorMessage.USER_NOT_FOUND);

    // Nếu login user là bản thân => Cho phép xem các bài viết của mình
    if (loginUserId === (user_id)) {
        const posts = await postDal.getPostsByMyselfIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
        return posts;
    }

    // Nếu tài khoản private
    if (userObj.is_private) {

        // Phải thỏa 2 điều kiện: trong danh sách follow và được accept
        if (followObj && followObj.follower_id === loginUserId && followObj?.status === FollowStatus.ACCEPTED && !followObj?.is_deleted) {
            const posts = await postDal.getPostsByFollowerIdDAL(user_id);
            if (!posts || posts.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
            return posts;
        } else {
            throw new Error(ErrorMessage.POST_NOT_FOUND);
        }

        // Tài khoản public
    } else {

        // Nếu user có trong danh sách follower của login user -> cho phép xem post với visibility != private
        if (followObj && followObj.follower_id === loginUserId) {
            const posts = await postDal.getPostsByFollowerIdDAL(user_id);
            if (!posts || posts.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
            return posts;
        }

        // Nếu là người khác => Chỉ cho các bài public
        const posts = await postDal.getPostsBySomeoneIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
        return posts;
    }
};

//Lấy 1 bài viết theo id
export const getPostById = async (loginUserId: string, post_id: string) => {
    const post = await postDal.getPostByIdDAL(post_id);
    const followObj = await getFollowByUserIdsDAL(loginUserId, post.user_id);

    const userObj = await getUserByIdDAL(post.user_id);
    if (!userObj) throw new Error(ErrorMessage.USER_NOT_FOUND);

    if (loginUserId === post.user_id) {
        if (!post || post.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
        return post;
    }

    if (userObj.is_private) {

        if (followObj && followObj.follower_id === loginUserId && followObj?.status === FollowStatus.ACCEPTED && !followObj?.is_deleted) {
            const post = await postDal.getPostByFollowerIdDAL(post_id, loginUserId);
            if (!post || post.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
            return post;
        } else {
            throw new Error(ErrorMessage.POST_NOT_FOUND);
        }

    } else {

        if (followObj && followObj === loginUserId && !followObj?.is_deleted) {
            const post = await postDal.getPostByFollowerIdDAL(post_id, loginUserId);
            if (!post || post.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
            return post;
        }

        const someOnePost = await postDal.getSomeonePostByIdDAL(post_id);
        if (!someOnePost || someOnePost.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);
        return someOnePost;
    }
};

export const countTotalSharedPostByIdL = async (id: string) => {
    const post = await postDal.getPostByIdDAL(id);
    if (post.visibility === Visibility.PUBLIC) {
        const countSharedPost = await postDal.countTotalSharedPostByIdDAL(id);
        return countSharedPost.rows;
    } return 0;
};

export const createPostDAL = async (
    user_id: string,
    content: string,
    media_url: string[],
    visibility: string
) => {

    validVisibilityStatus(visibility);

    const post = await postDal.createPostDAL(user_id, content, media_url, visibility);
    if (!post || post.length === 0) throw new Error(ErrorMessage.FAILED_CREATE_POST);

    await sendPostNotification(user_id, post);
    return;
};

export const createSharedPost = async (
    user_id: string,
    shared_post_id: string, // Lấy từ 1 post id cụ thể
    content: string,
    visibility: string
) => {

    validVisibilityStatus(visibility);

    //Kiểm tra trước khi share, post đó có tồn tại hay không
    const post = await postDal.getPostByIdDAL(shared_post_id);
    if (!post || post.length === 0) throw new Error(ErrorMessage.POST_NOT_FOUND);

    if (post.visibility === Visibility.PUBLIC) {
        const sharedPost = await postDal.createSharedPostDAL(user_id, shared_post_id, content, visibility);
        if (!sharedPost || sharedPost.length === 0) throw new Error(ErrorMessage.FAILED_CREATE_SHARED_POST);
        await sendPostNotification(user_id, sharedPost);
        return;
    }
    throw new Error(ErrorMessage.NO_PERMISSION_TO_ACCESS_POST);
};

export const updatePost = async (loginUserId: string, content: string, mediaUrl: string[], visibility: string, id: string) => {
    const post = {
        content: content,
        media_url: mediaUrl,
        visibility: visibility,
        id: id
    }

    validVisibilityStatus(visibility);

    return await postDal.updatePostDAL(post, id);
};

export const deletePost = async (loginUserId: string, id: string) => {
    const userPost = await postDal.getPostByIdDAL(id);

    if (loginUserId === userPost.user_id) {
        await postDal.deletePost(id);
        //Khi xóa post => xóa comment của post đó
        await deleteAllComment(id);
        return;
    }
    throw new Error(ErrorMessage.NO_PERMISSION_TO_ACCESS_POST);
};

const sendPostNotification = async (user_id: string, post: Post) => {
    const followers = await getAllFollowerDAL(user_id);
    const user = await getUserByIdDAL(user_id);
    const notificationContent = post.shared_post_id ? NotificationType.NEW_SHARED_POST : NotificationType.NEW_POST
    if (followers && followers.length > 0) {
        const io = getIO(); // Lấy instance của IO
        for (const follower of followers) {

            //Khi tạo 1 post. Đồng thời gửi thông báo đến followers
            const notification = await createNotification({
                recipient_id: follower.user_id,
                sender_id: user_id,
                content: generateNotificationContent(notificationContent, user.username),
                post_id: post.id,
                comment_id: undefined,
                follow_id: undefined
            });
            try {
                // Gửi thông báo qua Websocket tới follower
                io.to(follower.user_id).emit("notification", {
                    id: notification.id, // ID của thông báo
                    recipient_id: follower.user_id,
                    sender_id: user_id,
                    content: generateNotificationContent(notificationContent, user.username),
                    post_id: post.id,
                    created_at: dayjs(notification.created_at).format('YYYY-MM-DD HH:mm:ss'),
                    type: NotificationType.NEW_POST
                });
                console.log(`Notification sent to ${follower.user_id}`);
            } catch (error) {
                throw new Error(`Failed to send notification to ${follower.follower_id}: ${error}`);
            }
        }
    }
}