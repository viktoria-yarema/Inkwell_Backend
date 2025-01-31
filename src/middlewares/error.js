"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler = function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({
        status: "error",
        message: err.message,
    });
};
exports.default = errorHandler;
