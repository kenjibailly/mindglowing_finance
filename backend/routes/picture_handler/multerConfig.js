const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads");
    logger.warn(`Uploading to: ${uploadPath}`); // Log the upload path
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    logger.warn(`File will be saved as: ${filename}`); // Log the filename
    cb(null, filename);
  },
});

// Middleware to resize and compress images
const resizeAndCompressImage = async (req, res, next) => {
  if (!req.file) {
    logger.warn("No file found, skipping resize");
    return next();
  }

  try {
    logger.warn(`Resizing image at: ${req.file.path}`); // Log the image path

    // Resize and compress the image using sharp
    const resizedImageBuffer = await sharp(req.file.path)
      .resize({ width: 400 })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Save the resized image
    const resizedPath = path.resolve(
      req.file.destination,
      "resized",
      req.file.filename
    );
    logger.warn(`Saving resized image to: ${resizedPath}`); // Log the resized image path

    // Ensure the 'resized' directory exists
    fs.mkdirSync(path.dirname(resizedPath), { recursive: true });

    fs.writeFileSync(resizedPath, resizedImageBuffer);

    // Remove the original image
    fs.unlinkSync(req.file.path);

    logger.warn("Image processed successfully.");
    next();
  } catch (error) {
    logger.error("Error in resizing:", error);
    next(error);
  }
};

// Initialize multer with the storage configuration and the resizeAndCompressImage middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB (adjust as needed)
  },
}).single("picture"); // Adjust the fieldname as needed

// Middleware to log multer upload results
const multerUploadWithLogging = (req, res, next) => {
  logger.warn("Request body before upload:", req.body); // Log body before processing
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      logger.error("Multer error occurred:", err);
      return res.status(400).send({ error: "Multer error: " + err.message });
    } else if (err) {
      logger.error("Unknown error occurred:", err);
      return res.status(500).send({ error: "Unknown error: " + err.message });
    }
    logger.warn("Upload complete. Received file:", req.file); // Log after upload completes
    next();
  });
};

module.exports = { upload, resizeAndCompressImage, multerUploadWithLogging };
