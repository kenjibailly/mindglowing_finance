const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const User = require('../../models/user');
const Customer = require('../../models/customer');
const Customization = require('../../models/customization');
const Product = require('../../models/product');
const Discount = require('../../models/discount');
const Tax = require('../../models/tax');
const ShippingCompany = require('../../models/shipping_company');
const PaymentMethod = require('../../models/payment_method');
const formatDate = require('../formatters/date_formatter');
const authenticateToken = require('../security/authenticate');
const formatDateTime = require('../formatters/date_time_formatter');

// Get the invoice page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the invoice ID
    const invoice_id = req.params.id;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get invoice by id
        const invoice = await Invoice.findOne({ _id: invoice_id });

        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });

        // Use the find mehtod to get the customer
        const customer = await Customer.findOne({ _id: invoice.customer_id })

        // Use the find method to get the customization settings
        const customization = await Customization.findOne()

        // Map the product Ids
        let productsWithQuantity;
        if (invoice.products) {
          const productIdsWithQuantity = invoice.products.map(product => ({
            _id: product.id.toString(), // Convert ObjectId to string
            quantity: product.quantity
        }));
            
          // Find all products whose IDs are in the productIds array
          const products = await Product.find({ _id: { $in: productIdsWithQuantity.map(p => p._id) } });
            
          // Add the quantity information to each product
          productsWithQuantity = products.map(product => {
              const matchingProduct = productIdsWithQuantity.find(p => p._id === product._id.toString());
              return { ...product.toObject(), quantity: matchingProduct.quantity };
          });
        }
        
        // Map the discountIds
        const discountIds = invoice.discounts.map(discount => discount.id.toString());

        // Find all discounts whose IDs are in the discountIds array
        const discounts = await Discount.find({ _id: { $in: discountIds } });

        // Use the find method to get the tax
        const tax = await Tax.findById({ _id: invoice.tax.id });

        // Use the find method to get the tax
        var shipping_company;
        if (invoice.shipping.id) {
          shipping_company = await ShippingCompany.findById({ _id: invoice.shipping.id });
        }

        // Get the paid information from the invoice
        const { paid } = invoice;
        // Function to look up payment method name by id
        const getPaymentMethodName = async (paymentMethodId) => {
          const paymentMethod = await PaymentMethod.findById(paymentMethodId);
          return paymentMethod ? paymentMethod.name : null;
        };
        // Mapping through the paid array to modify each element
        const modifiedPaid = paid.map(async (payment) => {
          const { payment_method_id, paid_on, paid_amount } = payment;
          // Look up payment method name
          const paymentMethodName = await getPaymentMethodName(payment_method_id);
          // Creating the modified payment object with the desired properties
          const modifiedPayment = {
            paid_on: formatDate(paid_on, user_settings),
            paid_amount,
            payment_method: paymentMethodName,
          };
        
          return modifiedPayment;
        });
        // Assuming you want to await the results (since getPaymentMethodName is asynchronous)
        const modifiedPaidArray = await Promise.all(modifiedPaid);

        let product_totals = 0;
        let product_total = 0;
        if (productsWithQuantity) {
          product_totals = productsWithQuantity.map(product => {
            return product.price * product.quantity;
          });
          
          // Calculate the necessary totals to get to the amount left to pay
          product_total = product_totals.reduce((sum, price) => sum + parseFloat(price), 0);
        }
        // var discount_amounts_total = 0;
        // if (discount_ids_amounts_totals) {
        //   discount_amounts_total = discount_ids_amounts_totals.reduce((sum, total) => sum + parseFloat(total),0);
        // }
        // var discount_amounts_percentage = 0;
        // if (discount_ids_amounts_percentages) {
        //   discount_amounts_percentage = discount_ids_amounts_percentages.reduce((sum, percentage) => sum + parseFloat(percentage),0);
        // }
        // const tax_amount = (product_total + shipping_amount) / 100 * parseFloat(tax_id_tax_percentage);
        // var amount_total = product_total - discount_amounts_total - (product_total / 100 * discount_amounts_percentage) + shipping_amount + tax_amount;
        // var paid_total = 0;
        // if (paid_amount[0] !== "") {
        //   logger.log("PAID_AMOUNT: ", paid_amount)
        //   paid_total = paid_amount.reduce((sum, amount) => sum + parseFloat(amount), 0);
        // }
        // const amount_due = (paid_total > amount_total) ? 0 : (amount_total - paid_total);


        // Create a new array with modified timeTracking objects
        const modifiedTimeTracking = invoice.project_billed.timeTracking.map(timeTracking => ({
          ...timeTracking.toObject(), // Convert Mongoose document to plain object
          start: formatDateTime(timeTracking.start, user_settings),
          stop: formatDateTime(timeTracking.stop, user_settings)
        }));

        // Copy all properties from invoice to a new object
        const modifiedInvoice = {
          ...invoice.toObject(),
          project_billed: {
            ...invoice.project_billed.toObject(),
            timeTracking: modifiedTimeTracking // Use the modified timeTracking array
          }
        };

        // Check the modified invoice
        logger.log(modifiedInvoice);

        logger.log('Product total:', product_total);
        // logger.log('Shipping amount:', shipping_amount);
        // logger.log('Discount total percentage',discount_amounts_percentage)
        // logger.log('Discount flat total', discount_amounts_total)
        // logger.log('Tax amount:', tax_amount);
        // logger.log('Amount total:', amount_total);
        // logger.log('Paid total:', paid_total);
        // logger.log('Amount due:', amount_due);

        // Render the items page
        res.render('invoices/invoice', { 
          user: user_settings, 
          invoice: modifiedInvoice, 
          products: productsWithQuantity,
          discounts: discounts,
          tax: tax,
          shipping_company: shipping_company,
          paid: modifiedPaidArray,
          customer: customer,
          customization: customization,
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          user_settings: user_settings, 
          site_title: 'Invoice',
        });
      } catch (error) {
        logger.error(error);
        res.render('invoices/invoices', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
  });

module.exports = router;