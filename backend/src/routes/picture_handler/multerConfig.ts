import multer, { MulterError } from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: any, destination: string) => void
  ) {
    const uploadPath = path.join(__dirname, "../../../uploads");
    logger.success(`Uploading to: ${uploadPath}`); // Log the upload path
    cb(null, uploadPath);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: any, filename: string) => void
  ) {
    const filename =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    logger.success(`File will be saved as: ${filename}`); // Log the filename
    cb(null, filename);
  },
});

// Middleware to resize and compress images
const resizeAndCompressImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    logger.warn("No file found, skipping resize");
    return next();
  }

  try {
    logger.success(`Resizing image at: ${req.file.path}`); // Log the image path

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
    logger.success(`Saving resized image to: ${resizedPath}`); // Log the resized image path

    // Ensure the 'resized' directory exists
    fs.mkdirSync(path.dirname(resizedPath), { recursive: true });

    fs.writeFileSync(resizedPath, resizedImageBuffer);

    // Remove the original image
    fs.unlinkSync(req.file.path);

    logger.success("Image processed successfully.");
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
const multerUploadWithLogging = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.success("Request body before upload:", req.body); // Log body before processing
  upload(req, res, function (err) {
    if (err instanceof MulterError) {
      logger.error("Multer error occurred:", err);
      return res.status(400).send({ error: "Multer error: " + err.message });
    } else if (err) {
      logger.error("Unknown error occurred:", err);
      return res.status(500).send({ error: "Unknown error: " + err.message });
    }
    logger.success("Upload complete. Received file:", req.file); // Log after upload completes
    next();
  });
};

export { upload, resizeAndCompressImage, multerUploadWithLogging };
