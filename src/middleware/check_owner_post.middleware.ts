// src/middleware/checkPostOwner.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { PostDAL } from '../dal/post.dal';
import { AuthRequest } from './auth.middleware';

export const checkPostOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await PostDAL.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ message: 'You do not have allowed to access this post' });
    }

    next();
  } catch (err) {
    next(err);
  }
};
