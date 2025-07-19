import * as postDal from '../dal/post.dal';
import { getUserByIdDAL } from '../dal/user.dal';
import { getFollowByUserIdsDAL } from '../dal/follow.dal';
import { PostUpdate } from '../models/post.update.model';
import { validVisibilityStatus } from './validate_input_payload.service';
import { deleteAllComment } from './comment.service';

export const getAllPost = async () => {
    const posts = await postDal.getAllPostDAL();
    if (!posts || posts.length === 0) throw new Error('No post is existed!');
    return posts;
};

//Lấy danh sách bài viết theo user id
export const getPostsByUserId = async (loginUserId: string, user_id: string) => {
    const followObj = await getFollowByUserIdsDAL(loginUserId, user_id);
    const userObj = await getUserByIdDAL(user_id);

    // Nếu login user là bản thân => Cho phép xem các bài viết của mình
    if (loginUserId === (user_id)) {
        const posts = await postDal.getPostsByMyselfIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('post is not available!');
        return posts;
    }

    // Nếu tài khoản private
    if (userObj.is_private) {

        // Phải thỏa 2 điều kiện: trong danh sách follow và được accept
        if (followObj.follower_id === loginUserId && followObj?.status === 'ACCEPTED' && !followObj?.is_deleted) {
            const posts = await postDal.getPostsByFollowerIdDAL(user_id);
            if (!posts || posts.length === 0) throw new Error('post is not available!');
            return posts;
        } else {
            throw new Error('This profile is private!');
        }

        // Tài khoản public
    } else {

        // Nếu user có trong danh sách follower của login user -> cho phép xem post với visibility != private
        if (followObj.follower_id === loginUserId) {
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

    if (loginUserId.match(post.user_id)) {
        if (!post || post.length === 0) throw new Error('post is not available!');
        return post;
    }

    if (userObj.is_private) {
        if (followObj === loginUserId && followObj?.status === 'ACCEPTED' && !followObj?.is_deleted) {
            const post = await postDal.getPostByFollowerIdDAL(post_id, loginUserId);
            if (!post || post.length === 0) throw new Error('post is not available!');
            return post;
        } else {
            throw new Error('post is not available!');
        }
    } else {
        if (followObj === loginUserId && !followObj?.is_deleted) {
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
    const countSharedPost = await postDal.countTotalSharedPostByIdDAL(id);
    return countSharedPost.rows;
};

export const createPostDAL = async (
    user_id: string,
    content: string,
    media_url: string,
    visibility: string
) => {
    validVisibilityStatus(visibility);
    await postDal.createPostDAL(user_id, content, media_url, visibility);
};

export const createSharedPost = async (
    user_id: string,
    shared_post_id: string, // Lấy từ 1 post id cụ thể
    content: string,
    visibility: string
) => {
    await validVisibilityStatus(visibility);

    //Kiểm tra trước khi share, post đó có tồn tại hay không
    const post = await postDal.getPostByIdDAL(shared_post_id);

    if (!post || post.length === 0) throw new Error('No origin post has found');

    await postDal.createSharedPostDAL(user_id, shared_post_id, content, visibility);
};

export const updatePost = async (loginUserId: string, post: PostUpdate, id: string) => {
    const userPost = await postDal.getPostByIdDAL(id);

    if (loginUserId.match(userPost.user_id)) {
        const visibility: string = post.visibility || '';
        validVisibilityStatus(visibility);
        return await postDal.updatePostDAL(post, id);
    }
    throw new Error('You do not have permission to update this post');
};

export const deletePost = async (loginUserId: string, id: string) => {
    const userPost = await postDal.getPostByIdDAL(id);

    if (loginUserId.match(userPost.user_id)) {
        await postDal.deletePost(id);
        //Khi xóa post => xóa comment của post đó
        await deleteAllComment(id);
        return;
    }
    throw new Error('You do not have permission to delete this post');
};