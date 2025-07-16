import { validationResult } from 'express-validator';
import User from '../models/User.js';
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id).select('-password');
        const formattedUser = user?.toObject();
        if (!formattedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        formattedUser.id = formattedUser._id;
        res.json(formattedUser);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
export const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { firstName, lastName, phoneNumber, avatarUrl, email, pageContent } = req.body;
    try {
        const updateFields = {};
        if (firstName !== undefined)
            updateFields.firstName = firstName;
        if (lastName !== undefined)
            updateFields.lastName = lastName;
        if (phoneNumber !== undefined)
            updateFields.phoneNumber = phoneNumber;
        if (avatarUrl !== undefined)
            updateFields.avatarUrl = avatarUrl;
        if (email !== undefined)
            updateFields.email = email;
        if (pageContent !== undefined)
            updateFields.pageContent = pageContent;
        const user = await User.findByIdAndUpdate(req.user?.id, { $set: updateFields }, { new: true }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const formattedUser = user.toObject();
        formattedUser.id = formattedUser._id;
        res.json(formattedUser);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
//# sourceMappingURL=userController.js.map