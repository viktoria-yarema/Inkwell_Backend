import express from 'express';
import { check } from 'express-validator';
import { loginUser, logoutUser, refreshAccessToken, registerUser, } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
const router = express.Router();
router.post('/register-user', [
    check('email', 'Email is required').not().isEmpty().escape(),
    check('password', 'Password is required').not().isEmpty().escape(),
], registerUser);
router.post('/login', [
    check('email', 'Email is required').not().isEmpty().escape(),
    check('password', 'Password is required').not().isEmpty().escape(),
], loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', auth, logoutUser);
const authRoutes = router;
export default authRoutes;
//# sourceMappingURL=authRoutes.js.map