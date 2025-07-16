import mongoose from 'mongoose';
import { DB_URI } from '../utils/env.js';
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB Connected...');
    }
    catch (err) {
        console.error({ message: err.message });
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map