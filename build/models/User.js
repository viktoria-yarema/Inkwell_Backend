"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const env_1 = require("../utils/env.js");
const ExperienceCardSchema = new mongoose_1.Schema({
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
}, { _id: false });
const EducationCardSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    schoolName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
}, { _id: false });
const HomePageContentSchema = new mongoose_1.Schema({
    header: {
        brandName: { type: String, required: true },
        logoUrl: { type: String, required: true },
    },
    footer: {
        description: { type: String, required: true },
        copyright: { type: String, required: true },
    },
    hero: {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        imageUrl: { type: String, required: true },
    },
    latestArticles: {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
    },
    about: {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        imageUrl: { type: String, required: true },
    },
    categories: {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
    },
}, { _id: false });
const AboutPageContentSchema = new mongoose_1.Schema({
    intro: {
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    professionalExperience: [ExperienceCardSchema],
    philosophy: {
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    skills: [{ type: String }],
    educations: [EducationCardSchema],
}, { _id: false });
const ArticlesPageContentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
}, { _id: false });
const PageContentSchema = new mongoose_1.Schema({
    home: HomePageContentSchema,
    about: AboutPageContentSchema,
    articles: ArticlesPageContentSchema,
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
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
        required: false,
        default: 'user',
    },
    pageContent: {
        type: PageContentSchema,
        required: false,
    },
}, {
    timestamps: true,
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt_1.default.genSalt(Number(env_1.SALT));
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
UserSchema.methods.matchPassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map