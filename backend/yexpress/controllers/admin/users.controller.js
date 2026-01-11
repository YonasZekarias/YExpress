const User = require('../../models/User')
const logger = require('../../utils/logger')
const buildUserQuery = require("../../utils/userQueryBuilder");
const allUsers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const pipeline = buildUserQuery(req.query);
    const users = await User.aggregate(pipeline);

    let nextCursor = null;
    if (users.length > limit) {
      nextCursor = users[limit - 1]._id;
      users.pop();
    }

    res.status(200).json({
      nextCursor,
      results: users.length,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const getUserById = async (req, res) =>{
    try { 
        const user = await User.findById(req.params.userId).select('-password')
        if(!user) return res.status(404).json({error : "user not found"})
        res.status(200).json(user)
    } catch (error) {
        logger.error({error : "error fetching user", error})
        res.status(401).json({error : "error fetching user"})
    }
};
const banUnbanUser = async (req, res) =>{
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
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