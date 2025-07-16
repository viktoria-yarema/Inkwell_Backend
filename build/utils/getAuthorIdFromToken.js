"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorIdFromToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env.js");
const getAuthorIdFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.SERVER_SECRET);
        return decoded.id;
    }
    catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
};
exports.getAuthorIdFromToken = getAuthorIdFromToken;
//# sourceMappingURL=getAuthorIdFromToken.js.map