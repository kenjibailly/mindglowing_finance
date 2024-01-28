const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const Customer = require('../../models/customer');
const PaymentMethod = require('../../models/payment_method');
const Discount = require('../../models/discount');
const ShippingCompany = require('../../models/shipping_company');
const Items = require('../../models/item');
const Tax = require('../../models/tax');
const Customization = require('../../models/customization');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');
const formatDateToServerTimezone = require('../formatters/date_server_time_zone');

/* GET /invoices/create-customer page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    
    // Get all customers
    const customers = await Customer.find();
    // Get all items
    const items = await Items.find();
    // Get all payment methods
    const payment_methods = await PaymentMethod.find();
    // Get all discounts
    const discounts = await Discount.find();
    // Get all shipping companies
    const shipping_companies = await ShippingCompany.find();
    // Get all taxes
    const taxes = await Tax.find();

    // Find the last invoice number and create a new one
    const last_invoice = await Invoice.findOne().sort({ created_on: -1 }).limit(1);
    var new_invoice_number;

    if (last_invoice) {
      // Get the last invoice number
      const last_invoiceNumber = last_invoice.number;
      new_invoice_number = last_invoiceNumber + 1;
    } else {
        // When no invoices found
        new_invoice_number = 1;
    }

    // Get dustomization
    const customization = await Customization.findOne();

    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });

    // Render the create invoices page
    res.render('invoices/create_invoice', { 
      user: user_settings,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      customers: customers, 
      items: items, 
      payment_methods: payment_methods, 
      discounts: discounts, 
      shipping_companies: shipping_companies, 
      taxes: taxes, 
      new_invoice_number: new_invoice_number,
      customization: customization,
      site_title: 'Create Invoice',
    });

});

// Handle the POST request to add an invoice
router.post('/', authenticateToken, async (req, res) => {
    // Get the session user that's logged in
    const user = req.session.user;
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });

    // Extract form data from the request
    const {
      invoice_number,
      customer_id,
      item_ids,
      item_quantities,
      item_ids_prices,
      discount_ids,
      discount_ids_amounts_totals,
      discount_ids_amounts_percentages,
      tax_id,
      tax_id_tax_percentage,
      shipping_amount,
      shipping_company_id,
      paid_on,
      paid_amount,
      payment_method_id,
      description
  } = req.body;

  // Log or process the form fields as needed
  console.log('Invoice Number:', invoice_number);
  console.log('Customer ID:', customer_id);
  console.log('Item IDs:', item_ids);
  console.log('Item quantities:', item_quantities);
  console.log('Item prices:', item_ids_prices)
  console.log('Discount IDs:', discount_ids);
  console.log('Discount Amounts Total', discount_ids_amounts_totals);
  console.log('Discount Amounts Total', discount_ids_amounts_percentages);
  console.log('Tax ID:', tax_id);
  console.log('Tax Percentage:', tax_id_tax_percentage)
  console.log('Shipping Amount:', shipping_amount);
  console.log('Shipping Company ID:', shipping_company_id);
  console.log('Paid On:', paid_on);
  console.log('Paid Amount:', paid_amount);
  console.log('Payment Method IDs:', payment_method_id);
  console.log('Description:', description);


    // Get the item totals
    const item_totals = [];
    for (let i = 0; i < item_ids_prices.length; i++) {
        const item_total = item_ids_prices[i] * item_quantities[i];
        item_totals.push(parseFloat(item_total));
    }

    const status = "DRAFT";
    
    // Create items in right format with ids and quantities
    var items = []
    for (let i = 0; i < item_ids.length; i++) {
      items.push({
        id: item_ids[i],
        quantity: item_quantities[i]
      });
    }

    // Create discounts in the right format
    var discounts = []
    for (let i = 0; i < discount_ids.length; i++) {
      discounts.push({
        id: discount_ids[i],
        total: discount_ids_amounts_totals[i],
        percentage: discount_ids_amounts_percentages[i],
      });
    }

    console.log("DISCOUNTS: ", discounts)

    // Create paid on in the right format
    var paid = []
    for (let i = 0; i < paid_on.length; i++) {
      paid.push({
        paid_on: formatDateToServerTimezone(paid_on[i], user_settings),
        paid_amount: paid_amount[i],
        'payment_method.id': payment_method_id[i],
      });
    }

    console.log("PAID: ", paid)


    // Calculate the necessary totals to get to the amount left to pay
    const item_total = item_totals.reduce((sum, price) => sum + parseFloat(price), 0);
    const discount_amounts_total = discount_ids_amounts_totals.reduce((sum, total) => sum + parseFloat(total),0);
    const discount_amounts_percentage = discount_ids_amounts_percentages.reduce((sum, percentage) => sum + parseFloat(percentage),0);
    const tax_amount = (item_total + parseFloat(shipping_amount)) / 100 * parseFloat(tax_id_tax_percentage);
    const amount_total = item_total - discount_amounts_total - (item_total / 100 * discount_amounts_percentage) + parseFloat(shipping_amount) + tax_amount;
    const paid_total = paid_amount.reduce((sum, amount) => sum + parseFloat(amount), 0);
    const amount_due = (paid_total > amount_total) ? 0 : (amount_total - paid_total);

    console.log('Item total:', item_total);
    console.log('Shipping amount:', shipping_amount);
    console.log('Discount total percentage',discount_amounts_percentage)
    console.log('Discount flat total', discount_amounts_total)
    console.log('Tax percentage:', tax_amount);
    console.log('Amount total:', amount_total);
    console.log('Paid total:', paid_total);
    console.log('Amount due:', amount_due);
  
  
    try {
      // Save the invoice to the database
      const newInvoice = new Invoice({
        number: invoice_number,
        customer_id: customer_id[0],
        status: status,
        items: items,
        discounts: discounts,
        "tax.id": tax_id[0],
        "tax.total": tax_amount[0],
        "tax.percentage": tax_id_tax_percentage[0],
        "shipping.id": shipping_company_id[0],
        "shipping.amount": shipping_amount[0],
        paid: paid,
        amount_total: amount_total,
        amount_due: amount_due,
        description: description,
      });
      const savedInvoice = await newInvoice.save();
      res.redirect('/invoices/');
    } catch (error) {
      console.error(error);
    
      // Check if the error is a duplicate key violation
      if (error.code === 11000 && error.keyPattern && error.keyPattern['number']) {
        // Duplicate invoice number error
        res.status(400).json({ message: 'Same invoice number cannot be used twice' });
      } else {
        // Other internal server error
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  });

module.exports = router;