import { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

export const authenticateJWT: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized - No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
        };

        // ép lại kiểu cho req nếu cần
        (req as AuthRequest).user = { id: decoded.id, email: decoded.email };

        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
};
