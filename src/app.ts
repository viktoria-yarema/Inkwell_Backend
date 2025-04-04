import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./configs/db";
import authRoutes from "./routes/authRoutes";
import errorHandler from "./middlewares/error";
import { limiter } from "./middlewares/limiter";
import { PORT } from "./utils/env";
import articleRoutes from "./routes/articleRoutes";
import tagRoutes from "./routes/tagRoutes";
import cookieParser from "cookie-parser";

const app = express();
connectDB();
app.use(cookieParser());

// Configure CORS options
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 
};

app.use(cors(corsOptions)); 

app.use(express.json());
app.use("*", bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
app.set("trust proxy", "loopback, linklocal, uniquelocal");
app.use(limiter);

// routers connection
app.use("/api/", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/tags", tagRoutes);

app.listen(PORT, () => console.log("Server is running", PORT));
