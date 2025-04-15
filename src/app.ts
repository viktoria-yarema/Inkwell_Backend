import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import connectDB from './configs/db';
import errorHandler from './middlewares/error';
import { limiter } from './middlewares/limiter';
import articleRoutes from './routes/articleRoutes';
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes';
import tagRoutes from './routes/tagRoutes';
import { PORT } from './utils/env';

const app = express();
connectDB();
app.use(cookieParser());

// Configure CORS options
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

app.use(cors(corsOptions));

app.use(express.json());
app.use('*', bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
app.set('trust proxy', 'loopback, linklocal, uniquelocal');
app.use(limiter);

// routers connection
app.use('/api/', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/images', imageRoutes);

app.listen(PORT, () => console.log('Server is running', PORT));
