import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { SALT } from '../utils/env.js';
const UserSchema = new Schema({
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
}, {
    timestamps: true,
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(Number(SALT));
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.matchPassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=User.js.map