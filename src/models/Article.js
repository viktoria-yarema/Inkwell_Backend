"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema;
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        required: true,
    },
    tags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
}, {
    timestamps: true,
});
var Article = mongoose_1.default.model("Article", ArticleSchema);
exports.default = Article;
