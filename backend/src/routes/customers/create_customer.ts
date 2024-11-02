import express, { Request, Response, Router } from "express";
import Customer from "../../models/customer";
import { authenticateToken } from "../security/authenticate";

const router: Router = express.Router();

interface CustomerRequestBody {
  personal_information: {
    first_name: string;
    last_name: string;
    email: string;
    company?: string;
    currency: string;
  };
  billing_details?: {
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  shipping_details?: {
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  contact_information?: {
    preferred_contact_medium?: string;
    other_option_response?: string;
    contact_medium_username?: string;
  };
}

interface CustomError extends Error {
  code?: number;
  keyPattern?: { [key: string]: number };
}

const isEmptyShippingDetails = (body: CustomerRequestBody): boolean => {
  const shippingDetailsKeys = [
    "shipping_details.street",
    "shipping_details.street2",
    "shipping_details.city",
    "shipping_details.state",
    "shipping_details.zip",
    "shipping_details.country",
  ];

  return shippingDetailsKeys.every(
    (key) => !body[key as keyof CustomerRequestBody]
  );
};

// Handle the POST request to add a customer
router.post(
  "/",
  authenticateToken,
  async (req: Request<{}, {}, CustomerRequestBody>, res: Response) => {
    const {
      personal_information: { first_name, last_name, email, company, currency },
      billing_details = {
        street: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      shipping_details = {
        street: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      contact_information = {
        preferred_contact_medium: "",
        other_option_response: "",
        contact_medium_username: "",
      },
    } = req.body;

    // Check if billing details are empty, if so, use shipping details
    const shippingInfo = isEmptyShippingDetails(req.body)
      ? {
          street: billing_details.street,
          street2: billing_details.street2,
          city: billing_details.city,
          state: billing_details.state,
          zip: billing_details.zip,
          country: billing_details.country,
        }
      : {
          street: shipping_details.street,
          street2: shipping_details.street2,
          city: shipping_details.city,
          state: shipping_details.state,
          zip: shipping_details.zip,
          country: shipping_details.country,
        };
    const [currency_name, currency_symbol] = currency
      .split(" ")
      .map((part, index) => (index === 1 ? part.replace(/[()]/g, "") : part));

    // Create a new customer instance with the merged details
    const newCustomer = new Customer({
      personal_information: {
        first_name,
        last_name,
        email,
        company,
        currency_name,
        currency_symbol,
      },
      billing_details: {
        street: billing_details.street,
        street2: billing_details.street2,
        city: billing_details.city,
        state: billing_details.state,
        zip: billing_details.zip,
        country: billing_details.country,
      },
      shipping_details: shippingInfo,
      contact_information: {
        preferred_contact_medium: contact_information.preferred_contact_medium,
        other_option_response: contact_information.other_option_response,
        contact_medium_username: contact_information.contact_medium_username,
      },
    });

    try {
      // Save the customer to the database
      const savedCustomer = await newCustomer.save();
      res.json(savedCustomer);
    } catch (error) {
      const err = error as CustomError;

      // Check if the error is a duplicate key violation
      if (
        err.code === 11000 &&
        err.keyPattern &&
        err.keyPattern["personal_information.email"]
      ) {
        res.status(400).json({ message: "Same email cannot be used twice" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
);

export default router;
