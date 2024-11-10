import express, { Request, Response } from "express";
import Invoice from "../../models/invoice";
import User from "../../models/user";
import Customer from "../../models/customer";
import Customization from "../../models/customization";
import Product from "../../models/product";
import Discount from "../../models/discount";
import Tax from "../../models/tax";
import ShippingCompany from "../../models/shipping_company";
import PaymentMethod from "../../models/payment_method";
import formatDate from "../formatters/date_formatter";
import { authenticateToken } from "../security/authenticate";
import formatDateTime from "../formatters/date_time_formatter";
import mongoose from "mongoose";

const router = express.Router({ mergeParams: true });

// Get the invoice page by id
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // Get the session user that's logged in
    const user = req.session.user;

    // Get the invoice ID
    const invoice_id = req.params.id;

    try {
      // Use the find method to get the user settings
      const userSettings = await User.findOne({ username: user?.username });
      // Use the find method to get invoice by id
      const invoice = await Invoice.aggregate([
        // Match the specific invoice by _id
        {
          $match: {
            _id: new mongoose.Types.ObjectId(invoice_id), // Convert invoice_id to ObjectId
          },
        },
        // Convert customer_id to ObjectId if stored as a string
        {
          $addFields: {
            customer_id: { $toObjectId: "$customer_id" },
          },
        },
        // Join with Customer collection to get customer details
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer_details",
          },
        },
        {
          $unwind: {
            path: "$customer_details",
            preserveNullAndEmptyArrays: true, // Keeps the invoice even if no customer is found
          },
        },
        // Add a new field customer_name based on personal_information from the customer_details
        {
          $addFields: {
            customer_name: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: [
                        "$customer_details.personal_information.company",
                        "",
                      ],
                    },
                    {
                      $eq: [
                        "$customer_details.personal_information.company",
                        null,
                      ],
                    },
                  ],
                },
                then: {
                  $concat: [
                    "$customer_details.personal_information.first_name",
                    " ",
                    "$customer_details.personal_information.last_name",
                  ],
                },
                else: "$customer_details.personal_information.company",
              },
            },
          },
        },
        // Add a new field over_due based on due_date and amount_due conditions
        {
          $addFields: {
            over_due: {
              $and: [
                { $lt: ["$due_date", new Date()] }, // Checks if due_date is in the past
                { $gt: ["$amount_due", 0] }, // Checks if amount_due is greater than 0
              ],
            },
          },
        },
        {
          $addFields: {
            products: {
              $map: {
                input: "$products",
                as: "product",
                in: {
                  id: { $toObjectId: "$$product.id" },
                  quantity: "$$product.quantity",
                  _id: "$$product._id",
                },
              },
            },
          },
        },
        // Lookup to fetch detailed information for each product in the products array
        {
          $lookup: {
            from: "products",
            localField: "products.id",
            foreignField: "_id",
            as: "product_details",
          },
        },
        // Replace products array with the joined product details, matching by id
        {
          $addFields: {
            products: {
              $map: {
                input: "$products",
                as: "product",
                in: {
                  $mergeObjects: [
                    "$$product",
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$product_details",
                            as: "detail",
                            cond: { $eq: ["$$detail._id", "$$product.id"] },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        // Exclude the customer_details field from the result
        {
          $project: {
            customer_details: 0, // Excludes customer_details field
            product_details: 0,
          },
        },
      ]);

      const safeUserSettings = userSettings || {
        date_format: "en-US",
        time_zone: undefined,
      };

      // Format the invoice dates before returning
      const updatedInvoice =
        invoice.length > 0
          ? {
              ...invoice[0],
              created_on: formatDate(invoice[0].created_on, {
                time_zone: safeUserSettings.time_zone,
                date_format: safeUserSettings.date_format || "en-US",
              }),
              due_date: formatDate(invoice[0].due_date, {
                time_zone: safeUserSettings.time_zone,
                date_format: safeUserSettings.date_format || "en-US",
              }),
            }
          : null;

      if (!invoice) {
        res.status(404).send("Could not find invoice");
        return;
      }

      logger.warn(updatedInvoice);

      return;

      // // Use the find mehtod to get the customer
      // const customer = await Customer.findOne({ _id: invoice.customer_id });

      // // Use the find method to get the customization settings
      // const customizationSettings = await Customization.findOne();

      // // Map the product Ids
      // let productsWithQuantity;
      // if (invoice.products) {
      //   const productIdsWithQuantity = invoice.products.map((product) => ({
      //     _id: product.id.toString(), // Convert ObjectId to string
      //     quantity: product.quantity,
      //   }));

      //   // Find all products whose IDs are in the productIds array
      //   const products = await Product.find({
      //     _id: { $in: productIdsWithQuantity.map((p) => p._id) },
      //   });

      //   // Add the quantity information to each product
      //   productsWithQuantity = products.map((product) => {
      //     const matchingProduct = productIdsWithQuantity.find(
      //       (p) => p._id === product._id.toString()
      //     );
      //     return { ...product.toObject(), quantity: matchingProduct.quantity };
      //   });
      // }

      // // Map the discountIds
      // const discountIds = invoice.discounts.map((discount) =>
      //   discount.id.toString()
      // );

      // // Find all discounts whose IDs are in the discountIds array
      // const discounts = await Discount.find({ _id: { $in: discountIds } });

      // // Use the find method to get the tax
      // const tax = await Tax.findById({ _id: invoice.tax.id });

      // // Use the find method to get the tax
      // var shipping_company;
      // if (invoice.shipping.id) {
      //   shipping_company = await ShippingCompany.findById({
      //     _id: invoice.shipping.id,
      //   });
      // }

      // // Get the paid information from the invoice
      // const { paid } = invoice;
      // // Function to look up payment method name by id
      // const getPaymentMethodName = async (paymentMethodId) => {
      //   const paymentMethod = await PaymentMethod.findById(paymentMethodId);
      //   return paymentMethod ? paymentMethod.name : null;
      // };
      // // Mapping through the paid array to modify each element
      // const modifiedPaid = paid.map(async (payment) => {
      //   const { payment_method_id, paid_on, paid_amount } = payment;
      //   // Look up payment method name
      //   const paymentMethodName = await getPaymentMethodName(payment_method_id);
      //   // Creating the modified payment object with the desired properties
      //   const modifiedPayment = {
      //     paid_on: formatDate(paid_on, user_settings),
      //     paid_amount,
      //     payment_method: paymentMethodName,
      //   };

      //   return modifiedPayment;
      // });
      // // Assuming you want to await the results (since getPaymentMethodName is asynchronous)
      // const modifiedPaidArray = await Promise.all(modifiedPaid);

      // let product_totals = 0;
      // let product_total = 0;
      // if (productsWithQuantity) {
      //   product_totals = productsWithQuantity.map((product) => {
      //     return product.price * product.quantity;
      //   });

      //   // Calculate the necessary totals to get to the amount left to pay
      //   product_total = product_totals.reduce(
      //     (sum, price) => sum + parseFloat(price),
      //     0
      //   );
      // }
      // // var discount_amounts_total = 0;
      // // if (discount_ids_amounts_totals) {
      // //   discount_amounts_total = discount_ids_amounts_totals.reduce((sum, total) => sum + parseFloat(total),0);
      // // }
      // // var discount_amounts_percentage = 0;
      // // if (discount_ids_amounts_percentages) {
      // //   discount_amounts_percentage = discount_ids_amounts_percentages.reduce((sum, percentage) => sum + parseFloat(percentage),0);
      // // }
      // // const tax_amount = (product_total + shipping_amount) / 100 * parseFloat(tax_id_tax_percentage);
      // // var amount_total = product_total - discount_amounts_total - (product_total / 100 * discount_amounts_percentage) + shipping_amount + tax_amount;
      // // var paid_total = 0;
      // // if (paid_amount[0] !== "") {
      // //   logger.log("PAID_AMOUNT: ", paid_amount)
      // //   paid_total = paid_amount.reduce((sum, amount) => sum + parseFloat(amount), 0);
      // // }
      // // const amount_due = (paid_total > amount_total) ? 0 : (amount_total - paid_total);

      // // Create a new array with modified timeTracking objects
      // // const modifiedTimeTracking = invoice.project_billed.timeTracking.map(
      // //   (timeTracking) => ({
      // //     ...timeTracking.toObject(), // Convert Mongoose document to plain object
      // //     start: formatDateTime(timeTracking.start, user_settings),
      // //     stop: formatDateTime(timeTracking.stop, user_settings),
      // //   })
      // // );

      // // // Copy all properties from invoice to a new object
      // // const modifiedInvoice = {
      // //   ...invoice.toObject(),
      // //   project_billed: {
      // //     ...invoice.project_billed.toObject(),
      // //     timeTracking: modifiedTimeTracking, // Use the modified timeTracking array
      // //   },
      // //   due_date: formatDate(invoice.due_date, user_settings),
      // // };

      // // Check the modified invoice
      // logger.log(modifiedInvoice);

      // logger.log("Product total:", product_total);
      // logger.log('Shipping amount:', shipping_amount);
      // logger.log('Discount total percentage',discount_amounts_percentage)
      // logger.log('Discount flat total', discount_amounts_total)
      // logger.log('Tax amount:', tax_amount);
      // logger.log('Amount total:', amount_total);
      // logger.log('Paid total:', paid_total);
      // logger.log('Amount due:', amount_due);

      // Render the items page
      // res.render("invoices/invoice", {
      //   user: user_settings,
      //   invoice: modifiedInvoice,
      //   products: productsWithQuantity,
      //   discounts: discounts,
      //   tax: tax,
      //   shipping_company: shipping_company,
      //   paid: modifiedPaidArray,
      //   customer: customer,
      //   customization: customization,
      //   access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      //   user_settings: user_settings,
      //   site_title: "Invoice",
      // });
    } catch (error) {
      logger.error(error);
    }
  }
);

export default router;
