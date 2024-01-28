const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Middleware to resize and compress images
const resizeAndCompressImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        // Resize and compress the image using sharp
        const resizedImageBuffer = await sharp(req.file.path)
            .resize({ width: 400 })
            .jpeg({ quality: 80 })
            .toBuffer();

        // Save the resized image
        fs.writeFileSync(path.resolve(req.file.destination, 'resized', req.file.filename), resizedImageBuffer);

        // Remove the original image
        fs.unlinkSync(req.file.path);

        next();
    } catch (error) {
        next(error);
    }
};

// Initialize multer with the storage configuration and the resizeAndCompressImage middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB (adjust as needed)
    },
}).single('picture'); // Adjust the fieldname as needed

module.exports = { upload, resizeAndCompressImage };