import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { authenticateJWT } from '../middleware/authenJWT.middleware';

const router = Router();

// router.get('/my-posts', authenticateJWT, postController.getPostsByUserId);
