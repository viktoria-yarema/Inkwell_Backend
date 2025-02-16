import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./configs/db";
import authRoutes from "./routes/authRoutes";
import errorHandler from "./middlewares/error";
import { limiter } from "./middlewares/limiter";
import { PORT } from "./utils/env";
import articleRoutes from "./routes/articleRoutes";

const app = express();
connectDB();

// Configure CORS options
const corsOptions = {
  origin: function (origin: any, callback: any) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Debug which origins are being blocked
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Important: Place CORS before any other middleware
app.use(cors(corsOptions));

// Move other middleware after CORS
app.use(express.json());
app.use("*", bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
app.set("trust proxy", "loopback, linklocal, uniquelocal");
app.use(limiter);

// routers connection
app.use("/api/", authRoutes);
app.use("/api/articles", articleRoutes);

app.listen(PORT, () => console.log("Server is running", PORT));
