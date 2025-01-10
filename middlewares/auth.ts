import jwt from "jsonwebtoken";
import { SERVER_SECRET } from "../utils/env.js";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, SERVER_SECRET);

    if (typeof decoded !== "string" && "id" in decoded) {
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      return res.status(401).json({ message: "Token is not valid" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
