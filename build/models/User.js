var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { SALT } from "../utils/env";
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    avatarUrl: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true,
    },
}, {
    timestamps: true,
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        const salt = yield bcrypt.genSalt(SALT);
        this.password = yield bcrypt.hash(this.password, salt);
        next();
    });
});
UserSchema.methods.matchPassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.compare(candidatePassword, this.password);
    });
};
const User = mongoose.model("User", UserSchema);
export default User;
