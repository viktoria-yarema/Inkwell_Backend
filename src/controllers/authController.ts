import {
  JWT_EXPIRES_IN,
  SERVER_SECRET,
  JWT_REFRESH_EXPIRATION,
  JWT_REFRESH_SECRET,
} from "../utils/env";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import TokenBlacklist from "../models/TokenBlacklist";


const generateToken = (id: string): string => {
  const options: SignOptions = { expiresIn: Number(JWT_EXPIRES_IN) };
  return jwt.sign({ id }, SERVER_SECRET as Secret, options);
};

const generateRefreshToken = (id: string): string => {
  const options: SignOptions = { expiresIn: Number(JWT_REFRESH_EXPIRATION) };
  return jwt.sign({ id }, JWT_REFRESH_SECRET as Secret, options);
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    user = new User({
      email,
      password,
    });

    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.status(201).json({ token, refreshToken });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: "Server error while registration", error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "none",
    });

    res.status(201).json({ token });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

export const refreshAccessToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(403).json({ message: "Refresh token required" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.json({ token: newAccessToken });
  } catch (err: any) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logoutUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const accessToken = req.header("Authorization")?.replace("Bearer ", "");
    const refreshToken = req.cookies.refreshToken;
  
    if (!accessToken || !refreshToken) {
      res.status(400).json({ message: "Access and refresh tokens are required" });
      return;
    }

    const decodedAccessToken = jwt.verify(accessToken, SERVER_SECRET) as { exp: number };
    const accessTokenExpiresAt = new Date(decodedAccessToken.exp * 1000);
    await new TokenBlacklist({ token: accessToken, expiresAt: accessTokenExpiresAt }).save();

    const decodedRefreshToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { exp: number };
    const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000);
    await new TokenBlacklist({ token: refreshToken, expiresAt: refreshTokenExpiresAt }).save();
  
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" , error: err.message});
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
