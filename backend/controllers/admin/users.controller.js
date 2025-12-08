const User = require('../../models/User')
const logger = require('../../utils/logger')
const allUsers = async (req, res) =>{
    try {
        const users = await User.find().select('-password')
        res.status(401).json(users)
    } catch (error) {
        logger.error({error : "error fetching users", error})
    }
};
const getUserById = async (req, res) =>{
    try {
        const user = await User.findById(req.params.userID).select('-password')
        if(!user) return res.status(404).json({error : "user not found"})
        res.status(200).json(user)
    } catch (error) {
        logger.error({error : "error fetching user", error})
        res.status(401).json({error : "error fetching user"})
    }
};
const banUnbanUser = async (req, res) =>{
    try {
        const userID = req.params.userID;
        const user = await User.findById(userID);
        if(!user) return res.status(404).json({error : "user not found"})
        user.isBanned = !user.isBanned;
        await user.save();
        res.status(200).json({message : `user ${user.isBanned ? 'banned' : 'unbanned'} successfully`})
    } catch (error) {
        logger.error({error : "error banning/unbanning user", error})
        res.status(401).json({error : "error banning/unbanning user"})
    }
};
module.exports ={
    allUsers,
    getUserById,
    banUnbanUser,
}