import express from "express";
import { check } from "express-validator";
import {
  getUser,
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../controllers/authController";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/user", auth, getUser);

router.post(
  "/register-user",
  [
    check("email", "Email is required").not().isEmpty().escape(),
    check("password", "Password is required").not().isEmpty().escape(),
  ],
  registerUser,
);

router.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty().escape(),
    check("password", "Password is required").not().isEmpty().escape(),
  ],
  loginUser,
);

router.post("/refresh-token", refreshAccessToken);

const authRoutes = router;

export default authRoutes;
