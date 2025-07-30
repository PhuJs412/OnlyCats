import { getPostByIdDAL } from "../../dal/post.dal";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../authenJWT.middleware";
import { ErrorMessage } from "../../enums/errorEnums";
import { formatResponse } from "../../utils/responseFormat";

export const checkPostOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.user?.id || '';
    console.log(postId);
    try {
        const post = await getPostByIdDAL(postId);
        if (!post) {
            res.status(404).json(formatResponse(400, ErrorMessage.POST_NOT_FOUND));
            return;
        }
        if (post.user_id !== userId) {
            res.status(403).json(formatResponse(403, ErrorMessage.NO_PERMISSION_TO_ACCESS_POST));
            return;
        }
        next();
    } catch (error) {
        console.error("Error checking post owner:", error);
            res.status(500).json(formatResponse(500, ErrorMessage.INTERNAL_SERVER_ERROR));
    }
}