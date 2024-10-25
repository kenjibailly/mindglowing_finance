import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";
import User from "../models/user"; // Adjust the path if necessary
import { authenticateToken } from "./security/authenticate";
import { upload, resizeAndCompressImage } from "./picture_handler/multerConfig";

const router: Router = express.Router();

router.post(
  "/",
  authenticateToken,
  upload,
  resizeAndCompressImage,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.session.user;

      if (!user) {
        return res.status(401).send("User not authenticated");
      }

      const {
        date_format,
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

      const currency_name = currency.split(" ")[0];
      const currency_symbol = currency.split(" ")[1].replace(/[()]/g, "");

      // Update the user document in the database
      const updatedUser = await User.findOneAndUpdate(
        { username: user.username },
        {
          $set: {
            setup: false,
            date_format,
            currency_name,
            currency_symbol,
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
            picture: req.file ? req.file.filename : null,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      // Redirect or respond as needed
      res.redirect("/");
    } catch (error) {
      console.error(error); // Change this to your logger if needed
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
