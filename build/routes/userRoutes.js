import express from 'express';
import { check } from 'express-validator';
import { deleteUser, getUserById, updateUser } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
const router = express.Router();
router.use(auth);
router.get('/', getUserById);
router.put('/', [
    check('firstName', 'First name is optional').optional().escape(),
    check('lastName', 'Last name is optional').optional().escape(),
    check('phoneNumber', 'Phone number is optional').optional().escape(),
    check('avatarUrl', 'Avatar URL is optional').optional().escape(),
], updateUser);
router.delete('/', deleteUser);
const userRoutes = router;
export default userRoutes;
//# sourceMappingURL=userRoutes.js.map