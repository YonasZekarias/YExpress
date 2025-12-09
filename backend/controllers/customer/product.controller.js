const Product = require("../../models/Product");
const { redisClient } = require("../../config/redis");
const logger = require("../../utils/logger");
exports.getAllProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const cacheKey = `products:${category || 'all'}:page=${page}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.status(200).json({ success: true, cached: true, data: JSON.parse(cached) });
    }

    const filter = { deleted: false };
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate('category')
      .skip(skip)
      .limit(Number(limit))
      .lean(); // lean() makes it faster and cache-friendly

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const result = { products, total, totalPages, currentPage: Number(page) };

    await redisClient.setEx(cacheKey, 600, JSON.stringify(result));

    res.status(200).json({ success: true, cached: false, data: result });

  } catch (error) {
    logger.error({ error: "Error fetching products", details: error });
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const cacheKey = `product:${productId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.status(200).json({ success: true, cached: true, data: JSON.parse(cached) });
    }

    const product = await Product.findById(productId).populate('category');

    if (!product || product.deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await redisClient.setEx(cacheKey, 900, JSON.stringify(product));

    res.status(200).json({ success: true, cached: false, data: product });

  } catch (error) {
    logger.error({ error: "Error fetching product", details: error });
    res.status(500).json({ success: false, message: error.message });
  }
};
