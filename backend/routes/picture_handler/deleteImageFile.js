const path = require("path");
const fs = require("fs").promises;

// Function to delete an image file
async function deleteImageFile(filename) {
  if (filename) {
    try {
      const filePath = path.join("/app", "uploads", "resized", filename);
      await fs.unlink(filePath);
    } catch (error) {
      logger.error("Error deleting image file:", error);
    }
  }
}

module.exports = deleteImageFile;
