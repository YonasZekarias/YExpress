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

  if (search && search.trim() !== "") {
    matchStage.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }


  if (role && role !== "") {
    matchStage.role = role;
  }


  if (verified === "true" || verified === "false") {
    matchStage.verified = verified === "true";
  }

  if (isBanned === "true" || isBanned === "false") {
    matchStage.isBanned = isBanned === "true";
  }

  if (cursor) {
    matchStage._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  return [
    { $match: matchStage },
    { $sort: { _id: -1 } },
    { $limit: Number(limit) + 1 }, 
    {
      $project: {
        password: 0,
        __v: 0,
      },
    },
  ];
};

module.exports = buildUserQuery;