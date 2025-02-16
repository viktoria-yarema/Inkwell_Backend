import jwt from "jsonwebtoken";
import { SERVER_SECRET } from "../utils/env";
import User from "../models/User";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";
import TokenBlacklist from "../models/TokenBlacklist";

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return;
    }

    const blacklistedToken = await TokenBlacklist.findOne({ token });
    
    if (blacklistedToken) {
      res.status(401).json({ message: "Token is invalid" });
      return;
    }

    const decoded = jwt.verify(token, SERVER_SECRET) as { id: string };

    req.user = { id: decoded.id };

    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      res.status(401).json({ message: "Token is not valid" });
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
