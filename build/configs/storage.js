import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import { GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_STORAGE_BUCKET } from '../utils/env.js';
let storageOptions = {};
if (GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        if (fs.existsSync(GOOGLE_APPLICATION_CREDENTIALS)) {
            storageOptions = { keyFilename: GOOGLE_APPLICATION_CREDENTIALS };
            console.log('Using Google Cloud credentials from file:', GOOGLE_APPLICATION_CREDENTIALS);
        }
        else {
            try {
                const credentials = JSON.parse(GOOGLE_APPLICATION_CREDENTIALS);
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
const storage = new Storage(storageOptions);
const bucketName = GOOGLE_STORAGE_BUCKET.split('/').pop() || 'bucket';
const bucket = storage.bucket(bucketName);
export { bucket, storage };
//# sourceMappingURL=storage.js.map