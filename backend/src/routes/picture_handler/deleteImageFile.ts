import path from "path";
import fs from "fs/promises"; // Import fs with promises

// Function to delete an image file
const deleteImageFile = async (filename: string | undefined): Promise<void> => {
  if (filename) {
    try {
      const filePath = path.join("/app", "uploads", "resized", filename);
      await fs.unlink(filePath);
    } catch (error) {
      // Assuming logger is defined elsewhere in your codebase
      logger.error("Error deleting image file:", error);
    }
  }
};

export default deleteImageFile;
