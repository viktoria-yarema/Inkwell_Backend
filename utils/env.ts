import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export const SERVER_SECRET = process.env.JWT_SECRET || "";
export const SALT = parseInt(process.env.SALT || "10", 10);
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "";
export const DB_URI = process.env.DB_URI || "";
export const PORT = process.env.PORT || "";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || "";
