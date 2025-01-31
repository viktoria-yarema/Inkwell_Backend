"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
var express_rate_limit_1 = require("express-rate-limit");
exports.limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    headers: true,
});
