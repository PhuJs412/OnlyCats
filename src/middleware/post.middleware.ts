import { getPostByIdDAL } from "../dal/post.dal";
import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenJWT.middleware";

export const checkPostOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.user?.id || '';

    try {
        const post = await getPostByIdDAL(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (post.user_id !== userId) {
            res.status(403).json({ message: "You do not have permission to access this post" });
            return;
        }
        next();
    } catch (error) {
        console.error("Error checking post owner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}