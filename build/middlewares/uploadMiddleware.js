import multer from 'multer';
// Set up in-memory storage
const storage = multer.memoryStorage();
// File filter to only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'));
    }
};
// Configure the upload middleware
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB limit
    },
}).any();
//# sourceMappingURL=uploadMiddleware.js.map