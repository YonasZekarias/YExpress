const mongoose = require("mongoose");

const buildOrderQuery = (queryParams, currentUser) => {
  const {
    search,
    orderStatus,
    paymentStatus,
    paymentMethod,
    isPaid,
    startDate,
    endDate,
    cursor,
    limit = 10,
  } = queryParams;

  let matchStage = { deleted: false };

  /** -------------------------
   * USER VS ADMIN VISIBILITY
   * ------------------------ */
  if (currentUser.role !== "admin") {
    matchStage.user = new mongoose.Types.ObjectId(currentUser._id);
  }

  /** -------------------------
   * SEARCH
   * ------------------------ */
  if (search) {
    matchStage.$or = [
      { _id: mongoose.Types.ObjectId.isValid(search) ? new mongoose.Types.ObjectId(search) : null },
      { "paymentInfo.transactionId": { $regex: search, $options: "i" } },
    ];
  }

  /** -------------------------
   * FILTERS
   * ------------------------ */
  if (orderStatus) {
    matchStage.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    matchStage["paymentInfo.status"] = paymentStatus;
  }

  if (paymentMethod) {
    matchStage["paymentInfo.method"] = paymentMethod;
  }

  if (isPaid !== undefined) {
    matchStage.isPaid = isPaid === "true";
  }

  /** -------------------------
   * DATE RANGE
   * ------------------------ */
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  /** -------------------------
   * CURSOR PAGINATION
   * ------------------------ */
  if (cursor) {
    matchStage._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  /** -------------------------
   * PIPELINE
   * ------------------------ */
  const pipeline = [
    { $match: matchStage },

    // Sort newest first
    { $sort: { _id: -1 } },

    // Pagination (fetch one extra)
    { $limit: Number(limit) + 1 },

    /** -------------------------
     * POPULATE REFERENCES
     * ------------------------ */
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "products",
      },
    },

    {
      $lookup: {
        from: "productvariants",
        localField: "items.variant",
        foreignField: "_id",
        as: "variants",
      },
    },
  ];

  return pipeline;
};

module.exports = buildOrderQuery;
