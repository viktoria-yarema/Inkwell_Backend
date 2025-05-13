import jwt from 'jsonwebtoken';
import { SERVER_SECRET } from './env.js';
export const getAuthorIdFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SERVER_SECRET);
        return decoded.id;
    }
    catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
};
//# sourceMappingURL=getAuthorIdFromToken.js.map