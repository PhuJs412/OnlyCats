import * as postDal from '../dal/post.dal';
import { PostUpdate } from '../models/post.update.model';
import { validVisibilityStatus } from './validate_input_payload';


export const getAllPost = async () => {
    const posts = await postDal.getAllPostDAL();
    if (!posts || posts.length === 0) throw new Error('No post is existed!');
    return posts;
};

//Lấy danh sách bài viết theo user id
export const getPostsByUserId = async (loginUserId: string, user_id: string) => {
    //Nếu login user là bản thân => Cho phép xem các bài viết của mình
    if (loginUserId.match(user_id)) {
        const posts = await postDal.getPostsByMyselfIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('No post is existed!');
        return posts;
        // Nếu là người khác => Chỉ cho các bài public
    } else {
        const posts = await postDal.getPostsBySomeoneIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('No post is existed!');
        return posts;
    }
};

//Lấy 1 bài viết theo id
export const getPostById = async (loginUserId: string, user_id: string) => {
    //Nếu login user là bản thân => Cho phép xem bài viết của mình
    if (loginUserId.match(user_id)) {
        const posts = await postDal.getPostByIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('post is not available!');
        return posts;
    } else {
        const posts = await postDal.getSomeonePostByIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('post is not available!');
        return posts;
    }
};

export const countTotalSharedPostByIdL = async (id: string) => {
    return await postDal.countTotalSharedPostByIdDAL(id);
};

export const createPostDAL = async (
    user_id: string,
    content: string,
    media_url: string,
    visibility: string
) => {
    validVisibilityStatus(visibility);
    return await postDal.createPostDAL(user_id, content, media_url, visibility);
};

export const createSharedPost = async (
    user_id: string,
    shared_post_id: string, // Lấy từ 1 post id cụ thể
    content: string,
    visibility: string
) => {
    validVisibilityStatus(visibility);
    return await postDal.createSharedPostDAL(user_id, shared_post_id, content, visibility);
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