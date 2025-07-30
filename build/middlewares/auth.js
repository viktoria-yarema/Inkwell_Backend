import jwt from 'jsonwebtoken';
import TokenBlacklist from '../models/TokenBlacklist.js';
import User from '../models/User.js';
import { SERVER_SECRET } from '../utils/env.js';
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'No token, authorization denied' });
            return;
        }
        const blacklistedToken = await TokenBlacklist.findOne({ token });
        if (blacklistedToken) {
            res.status(401).json({ message: 'Token is invalid' });
            return;
        }
        let decoded;
        try {
            decoded = jwt.verify(token, SERVER_SECRET);
        }
        catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Token has expired' });
                return;
            }
            if (jwtError.name === 'JsonWebTokenError') {
                res.status(401).json({ message: 'Token is malformed or invalid' });
                return;
            }
            if (jwtError.name === 'NotBeforeError') {
                res.status(401).json({ message: 'Token is not active yet' });
                return;
            }
            // Handle any other JWT errors
            res.status(401).json({ message: 'Token verification failed' });
            return;
        }
        req.user = { id: decoded.id };
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Authorization is failed' });
    }
};
export default auth;
//# sourceMappingURL=auth.js.map