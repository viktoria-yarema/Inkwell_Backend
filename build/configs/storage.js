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
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.bucket = void 0;
const storage_1 = require("@google-cloud/storage");
const fs = __importStar(require("fs"));
const env_1 = require("../utils/env.js");
let storageOptions = {};
if (env_1.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        if (fs.existsSync(env_1.GOOGLE_APPLICATION_CREDENTIALS)) {
            storageOptions = { keyFilename: env_1.GOOGLE_APPLICATION_CREDENTIALS };
            console.log('Using Google Cloud credentials from file:', env_1.GOOGLE_APPLICATION_CREDENTIALS);
        }
        else {
            try {
                const credentials = JSON.parse(env_1.GOOGLE_APPLICATION_CREDENTIALS);
                storageOptions = { credentials };
                console.log('Using Google Cloud credentials from environment variable JSON');
            }
            catch (e) {
                console.error('Invalid Google Cloud credentials format:', e);
            }
        }
    }
    catch (err) {
        console.error('Error setting up Google Cloud credentials:', err);
    }
}
const storage = new storage_1.Storage(storageOptions);
exports.storage = storage;
const bucketName = env_1.GOOGLE_STORAGE_BUCKET.split('/').pop() || 'bucket';
const bucket = storage.bucket(bucketName);
exports.bucket = bucket;
//# sourceMappingURL=storage.js.map