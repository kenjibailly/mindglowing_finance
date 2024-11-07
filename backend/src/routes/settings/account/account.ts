import express, { Request, Response } from "express";
import User from "../../../models/user";
import { authenticateToken } from "../../security/authenticate";
import {
  upload,
  resizeAndCompressImage,
} from "../../picture_handler/multerConfig";
import deleteImageFile from "../../picture_handler/deleteImageFile";

const router = express.Router();

// Handle the update request
router.put(
  "/",
  authenticateToken,
  upload,
  resizeAndCompressImage,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Get the session user that's logged in
      const user = req.session.user;

      if (!user) {
        res.status(404).send("Could not find user");
        return;
      }

      // Use the find method to get the user settings
      const user_settings = await User.findOne({ username: user.username });

      const {
        date_format,
        time_zone,
        currency,
        "personal_information.first_name": first_name,
        "personal_information.last_name": last_name,
        "personal_information.email": email,
        "personal_information.company_name": company_name,
        "address_information.street": street,
        "address_information.street2": street2,
        "address_information.city": city,
        "address_information.state": state,
        "address_information.zip": zip,
        "address_information.country": country,
      } = req.body;

      if (!user_settings) {
        res.status(404).send("User not found");
        return;
      }

      const currency_name = currency.split(" ")[0];
      const currency_symbol = currency.split(" ")[1].replace(/[()]/g, "");

      var picture;
      // Check if a file was uploaded
      if (req.file) {
        picture = req.file.filename;
        // Otherwise keep the old picture
      } else {
        picture = user_settings.picture;
      }

      // If the item had a picture and there's a new one
      if (user_settings.picture && req.file) {
        // Delete the image file
        await deleteImageFile(user_settings.picture);
      }

      // Update the item in the database
      const result = await User.findByIdAndUpdate(
        user_settings._id,
        {
          $set: {
            setup: false,
            date_format: date_format,
            time_zone: time_zone,
            currency_name: currency_name,
            currency_symbol: currency_symbol,
            "personal_information.first_name": first_name,
            "personal_information.last_name": last_name,
            "personal_information.email": email,
            "personal_information.company_name": company_name,
            "address_information.street": street,
            "address_information.street2": street2,
            "address_information.city": city,
            "address_information.state": state,
            "address_information.zip": zip,
            "address_information.country": country,
            picture: picture,
          },
        },
        { new: true, runValidators: true }
      );

      if (!result) {
        res.status(404).send("User not found");
        return;
      }

      res.status(201).json(result);
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }
);

export default router;
