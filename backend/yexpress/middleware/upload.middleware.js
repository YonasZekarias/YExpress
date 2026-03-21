const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 15 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image uploads are allowed"));
  },
});

function uploadImagesMiddleware(req, res, next) {
  upload.array("images", 15)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Upload failed",
      });
    }
    next();
  });
}

module.exports = { uploadImagesMiddleware };
