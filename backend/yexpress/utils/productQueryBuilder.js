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

  let matchStage = { deleted: { $ne: true } };

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category && mongoose.isValidObjectId(category)) {
    matchStage.category = new mongoose.Types.ObjectId(category);
  }

  if (cursor && mongoose.isValidObjectId(cursor)) {
    matchStage._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  let pipeline = [
    // 1. Filter Products
    { $match: matchStage },

    // ---------------------------------------------------------
    // NEW: Populate Category (Lookup + Unwind)
    // ---------------------------------------------------------
    {
      $lookup: {
        from: "categories",       // Ensure this matches your MongoDB collection name exactly (usually lowercase plural)
        localField: "category",   // Field in Product
        foreignField: "_id",      // Field in Category
        as: "category"            // Overwrite the existing 'category' field
      }
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true // Keep product even if category is missing/deleted
      }
    },
    // ---------------------------------------------------------

    // 2. Lookup Variants (Existing)
    {
      $lookup: {
        from: "productvariants",
        localField: "_id",
        foreignField: "product",
        as: "ProductVariant",
      },
    },

    // 3. Filter Variants by Price
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
          // Remove products with 0 variants after filtering
          {
             $match: {
               "ProductVariant": { $not: { $size: 0 } }
             }
          }
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