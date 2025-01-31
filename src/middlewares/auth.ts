import jwt from "jsonwebtoken";
import { SERVER_SECRET } from "../utils/env";
import User from "../models/User";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SERVER_SECRET) as { id: string };

    req.user = { id: decoded.id };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "Token is not valid" });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
