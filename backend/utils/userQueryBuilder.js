const mongoose = require("mongoose");

const buildUserQuery = (queryParams) => {
  const {
    search,
    role,
    verified,
    isBanned,
    cursor,
    limit = 10,
  } = queryParams;

  let matchStage = {};


  if (search) {
    matchStage.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }


  if (role) {
    matchStage.role = role;
  }

  if (verified !== undefined) {
    matchStage.verified = verified === "true";
  }

  if (isBanned !== undefined) {
    matchStage.isBanned = isBanned === "true";
  }


  if (cursor) {
    matchStage._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }


  const pipeline = [
    { $match: matchStage },

    // Sort newest first
    { $sort: { _id: -1 } },

    // Fetch one extra to detect next page
    { $limit: Number(limit) + 1 },

    // Remove sensitive fields
    {
      $project: {
        password: 0,
        __v: 0,
      },
    },
  ];

  return pipeline;
};

module.exports = buildUserQuery;
