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
import userRoutes from './routes/userRoutes';
import { PORT } from './utils/env';

const app = express();
connectDB();

app.use(cookieParser());

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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.set('trust proxy', 'loopback, linklocal, uniquelocal');
app.use(limiter);
app.use(express.static('public'));

app.use('/api/', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log('Server is running', PORT));
