const User = require('../../models/User');
const logger = require('../../utils/logger');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        logger.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
const editUserProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        logger.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = {
    getUserProfile,
    editUserProfile,
};