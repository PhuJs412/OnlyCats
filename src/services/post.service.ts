import * as postDal from '../dal/post.dal';
import { PostUpdate } from '../models/post.update.model';
import { validVisibilityStatus } from './validate_input_payload.service';
import { deleteAllComment } from './comment.service';
import { getAllFollowerUser } from './follow.service';

export const getAllPost = async () => {
    const posts = await postDal.getAllPostDAL();
    if (!posts || posts.length === 0) throw new Error('No post is existed!');
    return posts;
};

//Lấy danh sách bài viết theo user id
export const getPostsByUserId = async (loginUserId: string, user_id: string) => {
    const followerUserList = await getAllFollowerUser(user_id);
    const followerUserId = followerUserList.map(user => user.follower_user_id);

    //Nếu login user là bản thân => Cho phép xem các bài viết của mình
    if (loginUserId.match(user_id)) {
        const posts = await postDal.getPostsByMyselfIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('post is not available!');
        return posts;

        // Nếu user có trong danh sách follower của login user -> add cho phép xem post với visibility != private
    } else if (followerUserId.includes(loginUserId)) {
        const posts = await postDal.getPostsByFollowerIdDAL(user_id);
        if (!posts || posts.length === 0) throw new Error('post is not available!');
        return posts;
    }

    // Nếu là người khác => Chỉ cho các bài public
    const posts = await postDal.getPostsBySomeoneIdDAL(user_id);
    if (!posts || posts.length === 0) throw new Error('post is not available!');
    return posts;
};

//Lấy 1 bài viết theo id
export const getPostById = async (loginUserId: string, post_id: string) => {
    const post = await postDal.getPostByIdDAL(post_id);
    const followerUserList = await getAllFollowerUser(post.user_id);
    const followerUserId = followerUserList.map(user => user.follower_user_id);

    if (!post || post.length === 0) throw new Error('post is not available!');

    //Nếu login user là chính chủ của post => Cho phép xem bài viết của mình
    if (loginUserId.match(post.user_id)) {
        return post;

        // Nếu post đang xem của user mà follower đó có theo dõi => cho xem    
    } else if (followerUserId.includes(loginUserId)) {
        const followingPost = await postDal.getPostByFollowerIdDAL(post_id, loginUserId);
        if (!followingPost || followingPost.length === 0) throw new Error('post is not available!');
        return followingPost;
    }

    // Nếu không => trả post = rỗng
    const someOnePost = await postDal.getSomeonePostByIdDAL(post_id);
    if (!someOnePost || someOnePost.length === 0) throw new Error('post is not available!');
    return someOnePost;
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