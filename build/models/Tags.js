import mongoose from 'mongoose';
const Schema = mongoose.Schema;
export var InkwellIcon;
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
})(InkwellIcon || (InkwellIcon = {}));
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
const Tag = mongoose.model('Tag', TagSchema);
export default Tag;
//# sourceMappingURL=Tags.js.map