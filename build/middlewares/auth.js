var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { SERVER_SECRET } from "../utils/env";
import User from "../models/User";
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token, authorization denied" });
        return;
    }
    try {
        const decoded = jwt.verify(token, SERVER_SECRET);
        req.user = { id: decoded.id };
        const user = yield User.findById(decoded.id).select("-password");
        if (!user) {
            res.status(401).json({ message: "Token is not valid" });
            return;
        }
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
});
export default auth;
