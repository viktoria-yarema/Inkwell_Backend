"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../utils/env.js");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.DB_URI);
        console.log('MongoDB Connected...');
    }
    catch (err) {
        console.error({ message: err.message });
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map