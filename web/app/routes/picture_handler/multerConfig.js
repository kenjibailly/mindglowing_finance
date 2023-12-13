const multer = require('multer');
const path = require('path');

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Initialize multer with the storage configuration
// Increase the limits for file size (adjust values as needed)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB (adjust as needed)
    },
});

module.exports = upload;
