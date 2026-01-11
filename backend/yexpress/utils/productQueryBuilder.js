const mongoose = require("mongoose");

const buildProductQuery = (queryParams) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    cursor,
    limit = 10,
  } = queryParams;

  let matchStage = { deleted: false };

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    matchStage.category = new mongoose.Types.ObjectId(category);
  }

  if (cursor) {
    matchStage._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  let pipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product",
        as: "ProductVariant",
      },
    },

    ...(minPrice || maxPrice
      ? [
          {
            $addFields: {
              ProductVariant: {
                $filter: {
                  input: "$ProductVariant",
                  as: "variant",
                  cond: {
                    $and: [
                      minPrice
                        ? { $gte: ["$$variant.price", Number(minPrice)] }
                        : true,
                      maxPrice
                        ? { $lte: ["$$variant.price", Number(maxPrice)] }
                        : true,
                    ],
                  },
                },
              },
            },
          },
        ]
      : []),

    {
      $addFields: {
        lowestPrice: { $min: "$ProductVariant.price" },
      },
    },

    { $sort: { _id: -1 } },
    { $limit: Number(limit) + 1 },
  ];

  return pipeline;
};

module.exports = buildProductQuery;
