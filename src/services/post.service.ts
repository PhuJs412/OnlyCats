import dayjs from 'dayjs';
import * as postDal from '../dal/post.dal';
import { getUserByIdDAL } from '../dal/user.dal';
import { getFollowByUserIdsDAL, getAllFollowerDAL } from '../dal/follow.dal';
import { PostUpdate } from '../models/post.update.model';
import { validVisibilityStatus } from './validate_input_payload.service';
import { deleteAllComment } from './comment.service';
import { createNotification } from './notification.service';
import { generateNotificationContent } from './notification.service';
import { NotificationType } from '../utils/enums';
import { getIO } from '../socket/socket';
import { Post } from '../models/post.model';
import { Follows } from '../models/follow.model';

export const getAllPost = async () => {
    const posts = await postDal.getAllPostDAL();
    if (!posts || posts.length === 0) throw new Error('No post is existed!');
    return posts;
};

//Lấy danh sách bài viết theo user id
export const getPostsByUserId = async (loginUserId: string, user_id: string) => {
    const followObj: Follows = await getFollowByUserIdsDAL(loginUserId, user_id);

    const userObj = await getUserByIdDAL(user_id);
    if (!userObj) throw new Error('User not found!');

    // Nếu login user là bản thân => Cho phép xem các bài viết của mình
    if (loginUserId === (user_id)) {
        const posts = await postDal.getPostsByMyselfIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('post is not available!');
        return posts;
    }

    // Nếu tài khoản private
    if (userObj.is_private) {

        // Phải thỏa 2 điều kiện: trong danh sách follow và được accept
        if (followObj && followObj.follower_id === loginUserId && followObj?.status === 'ACCEPTED' && !followObj?.is_deleted) {
            const posts = await postDal.getPostsByFollowerIdDAL(user_id);
            if (!posts || posts.length === 0) throw new Error('post is not available!');
            return posts;
        } else {
            throw new Error('This profile is private!');
        }

        // Tài khoản public
    } else {

        // Nếu user có trong danh sách follower của login user -> cho phép xem post với visibility != private
        if (followObj && followObj.follower_id === loginUserId) {
            const posts = await postDal.getPostsByFollowerIdDAL(user_id);
            if (!posts || posts.length === 0) throw new Error('post is not available!');
            return posts;
        }

        // Nếu là người khác => Chỉ cho các bài public
        const posts = await postDal.getPostsBySomeoneIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('post is not available!');
        return posts;
    }
};

//Lấy 1 bài viết theo id
export const getPostById = async (loginUserId: string, post_id: string) => {
    const post = await postDal.getPostByIdDAL(post_id);
    const followObj = await getFollowByUserIdsDAL(loginUserId, post.user_id);

    const userObj = await getUserByIdDAL(post.user_id);
    if (!userObj) throw new Error('User not found!');

    if (loginUserId === post.user_id) {
        if (!post || post.length === 0) throw new Error('post is not available!');
        return post;
    }

    if (userObj.is_private) {

        if (followObj && followObj.follower_id === loginUserId && followObj?.status === 'ACCEPTED' && !followObj?.is_deleted) {
            const post = await postDal.getPostByFollowerIdDAL(post_id, loginUserId);
            if (!post || post.length === 0) throw new Error('post is not available!');
            return post;
        } else {
            throw new Error('post is not available!');
        }

    } else {

        if (followObj && followObj === loginUserId && !followObj?.is_deleted) {
            const post = await postDal.getPostByFollowerIdDAL(post_id, loginUserId);
            if (!post || post.length === 0) throw new Error('post is not available!');
            return post;
        }

        const someOnePost = await postDal.getSomeonePostByIdDAL(post_id);
        if (!someOnePost || someOnePost.length === 0) throw new Error('post is not available!');
        return someOnePost;
    }
};

export const countTotalSharedPostByIdL = async (id: string) => {
    const post = await postDal.getPostByIdDAL(id);
    if (post.visibility === 'public') {
        const countSharedPost = await postDal.countTotalSharedPostByIdDAL(id);
        return countSharedPost.rows;
    } return 0;
};

export const createPostDAL = async (
    user_id: string,
    content: string,
    media_url: string,
    visibility: string
) => {

    validVisibilityStatus(visibility);

    const post = await postDal.createPostDAL(user_id, content, media_url, visibility);
    if (!post || post.length === 0) throw new Error('Failed to create post record');

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
    if (!post || post.length === 0) throw new Error('No origin post has found');

    if (post.visibility === 'public') {
        const sharedPost = await postDal.createSharedPostDAL(user_id, shared_post_id, content, visibility);
        if (!sharedPost || sharedPost.length === 0) throw new Error('Failed to create shared post record');
        await sendPostNotification(user_id, sharedPost);
        return;
    }
    throw new Error('You can only share public posts');
};

export const updatePost = async (loginUserId: string, post: PostUpdate, id: string) => {
    const userPost = await postDal.getPostByIdDAL(id);

    if (loginUserId === userPost.user_id) {
        const visibility: string = post.visibility || '';
        validVisibilityStatus(visibility);
        return await postDal.updatePostDAL(post, id);
    }
    throw new Error('You do not have permission to update this post');
};

export const deletePost = async (loginUserId: string, id: string) => {
    const userPost = await postDal.getPostByIdDAL(id);

    if (loginUserId === userPost.user_id) {
        await postDal.deletePost(id);
        //Khi xóa post => xóa comment của post đó
        await deleteAllComment(id);
        return;
    }
    throw new Error('You do not have permission to delete this post');
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
            console.log(`Notification created with : ${notification}`);
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