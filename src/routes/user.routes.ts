import { Router } from 'express';
import * as controller from '../controllers/user.controller';

const router = Router();

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.get('/search/:username', controller.searchUserByUsername);
router.patch('/:id', controller.updateUser);
router.patch('/change-password/:id', controller.changePassword);
router.delete('/:id', controller.deleteUser);

export default router;
