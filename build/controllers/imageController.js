"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPageContentImage = exports.uploadArticleImage = void 0;
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const storage_1 = require("../configs/storage.js");
const getAuthorIdFromToken_1 = require("../utils/getAuthorIdFromToken.js");
const uploadArticleImage = async (req, res, next) => {
    try {
        const authorId = (0, getAuthorIdFromToken_1.getAuthorIdFromToken)(req);
        if (!authorId) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
            return;
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const file = req.files[0];
        const { originalname, buffer, mimetype } = file;
        const fileExtension = path.extname(originalname);
        const filename = `${(0, uuid_1.v4)()}${fileExtension}`;
        const filePath = `${authorId}/articles/${filename}`;
        const blob = storage_1.bucket.file(filePath);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: mimetype,
            },
        });
        blobStream.on('error', err => {
            console.error('Upload error:', err);
            next(err);
        });
        blobStream.on('finish', async () => {
            res.status(200).json({
                message: 'Upload successful',
                imageId: filename,
            });
        });
        blobStream.end(buffer);
    }
    catch (err) {
        console.error('Upload error:', err);
        next(err);
    }
};
exports.uploadArticleImage = uploadArticleImage;
const uploadPageContentImage = async (req, res, next) => {
    try {
        const authorId = (0, getAuthorIdFromToken_1.getAuthorIdFromToken)(req);
        if (!authorId) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
            return;
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const { pageVariant, section } = req.body;
        const file = req.files[0];
        const { originalname, buffer, mimetype } = file;
        const fileExtension = path.extname(originalname);
        const filename = `${(0, uuid_1.v4)()}${fileExtension}`;
        const filePath = `${authorId}/page-content/${pageVariant}/${section}/${filename}`;
        const blob = storage_1.bucket.file(filePath);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: mimetype,
            },
        });
        blobStream.on('error', err => {
            console.error('Upload error:', err);
            next(err);
        });
        blobStream.on('finish', async () => {
            res.status(200).json({
                message: 'Upload successful',
                imageId: filename,
            });
        });
        blobStream.end(buffer);
    }
    catch (err) {
        console.error('Upload error:', err);
        next(err);
    }
};
exports.uploadPageContentImage = uploadPageContentImage;
//# sourceMappingURL=imageController.js.map