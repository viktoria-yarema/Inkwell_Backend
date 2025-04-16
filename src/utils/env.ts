import dotenv from 'dotenv';

dotenv.config();

export const SERVER_SECRET = process.env.JWT_SECRET || '';
export const SALT = process.env.SALT || '';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '';
export const DB_URI = process.env.DB_URI || '';
export const PORT = process.env.PORT || '';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '';
export const GOOGLE_STORAGE_BUCKET = process.env.INKWELL_GOOGLE_STORAGE_BUCKET || '';
export const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';
