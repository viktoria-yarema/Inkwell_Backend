"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_APPLICATION_CREDENTIALS = exports.GOOGLE_STORAGE_BUCKET = exports.JWT_REFRESH_EXPIRATION = exports.JWT_REFRESH_SECRET = exports.PORT = exports.DB_URI = exports.JWT_EXPIRES_IN = exports.SALT = exports.SERVER_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SERVER_SECRET = process.env.JWT_SECRET || '';
exports.SALT = process.env.SALT || '';
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '';
exports.DB_URI = process.env.DB_URI || '';
exports.PORT = process.env.PORT || '8080';
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
exports.JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '';
exports.GOOGLE_STORAGE_BUCKET = process.env.INKWELL_GOOGLE_STORAGE_BUCKET || '';
exports.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';
//# sourceMappingURL=env.js.map