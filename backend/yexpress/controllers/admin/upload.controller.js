const { Readable } = require("stream");
const cloudinary = require("../../config/cloudinary");
const logger = require("../../utils/logger");

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const folder = process.env.CLOUDINARY_FOLDER || "yexpress";
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

const uploadImages = async (req, res) => {
  try {
    const missing =
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET;
    if (missing) {
      return res.status(503).json({
        success: false,
        message:
          "Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    if (!req.files?.length) {
      return res
        .status(400)
        .json({ success: false, message: "No image files received" });
    }

    const urls = [];
    for (const file of req.files) {
      urls.push(await uploadBuffer(file.buffer));
    }

    res.status(200).json({ success: true, urls });
  } catch (err) {
    logger.error("Cloudinary upload error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to upload images",
    });
  }
};

module.exports = { uploadImages };
