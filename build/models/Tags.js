"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InkwellIcon = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
var InkwellIcon;
(function (InkwellIcon) {
    InkwellIcon["BookOpen"] = "BookOpen";
    InkwellIcon["Pencil"] = "Pencil";
    InkwellIcon["PaintBrush"] = "PaintBrush";
    InkwellIcon["Palette"] = "Palette";
    InkwellIcon["Users"] = "Users";
    InkwellIcon["Smile"] = "Smile";
    InkwellIcon["Apple"] = "Apple";
    InkwellIcon["Calendar"] = "Calendar";
    InkwellIcon["Camera"] = "Camera";
    InkwellIcon["Video"] = "Video";
    InkwellIcon["MessageCircle"] = "MessageCircle";
    InkwellIcon["Image"] = "Image";
    InkwellIcon["List"] = "List";
    InkwellIcon["CheckCircle"] = "CheckCircle";
    InkwellIcon["Heart"] = "Heart";
    InkwellIcon["Star"] = "Star";
    InkwellIcon["Globe"] = "Globe";
    InkwellIcon["Clipboard"] = "Clipboard";
    InkwellIcon["Bell"] = "Bell";
    InkwellIcon["FileText"] = "FileText";
})(InkwellIcon || (exports.InkwellIcon = InkwellIcon = {}));
const TagSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        enum: Object.values(InkwellIcon),
        required: false,
    },
}, {
    timestamps: true,
});
const Tag = mongoose_1.default.model('Tag', TagSchema);
exports.default = Tag;
//# sourceMappingURL=Tags.js.map