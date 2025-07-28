import { getUserByIdDAL } from "../dal/user.dal";
import { Response } from "express";
import { AuthRequest } from "./authenJWT.middleware";
import { NextFunction } from "express";

export const checkLoginUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized: User not authenticated" });
        return;
    }
    const userId = req.user?.id
    try {
        const user = await getUserByIdDAL(userId);
        if (!user) {
            res.status(404).json({ message: "Unauthorized" });
            return;
        }
        next();
    } catch (error) {
        console.error("Error checking login user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};