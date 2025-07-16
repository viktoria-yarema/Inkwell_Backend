"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./configs/db.js"));
const error_1 = __importDefault(require("./middlewares/error.js"));
const limiter_1 = require("./middlewares/limiter.js");
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes.js"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes.js"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes.js"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes.js"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes.js"));
const env_1 = require("./utils/env.js");
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.set('trust proxy', 'loopback, linklocal, uniquelocal');
app.use(limiter_1.limiter);
app.use(express_1.default.static('public'));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.use('/api/', authRoutes_1.default);
app.use('/api/articles', articleRoutes_1.default);
app.use('/api/tags', tagRoutes_1.default);
app.use('/api/images', imageRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use(error_1.default);
app.listen(env_1.PORT, () => console.log('Server is running', env_1.PORT));
//# sourceMappingURL=app.js.map