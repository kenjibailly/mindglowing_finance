const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const Customer = require('../../models/customer');
const PaymentMethod = require('../../models/payment_method');
const Discount = require('../../models/discount');
const ShippingCompany = require('../../models/shipping_company');
const Products = require('../../models/product');
const Tax = require('../../models/tax');
const Customization = require('../../models/customization');
const User = require('../../models/user');
const Project = require('../../models/project');
const authenticateToken = require('../security/authenticate');
const formatDateToServerTimezone = require('../formatters/date_server_time_zone');
const formatTime = require('../formatters/time_formatter');
const formatDateTime = require('../formatters/date_time_formatter');

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
    // Get all products
    const products = await Products.find();
    // Get all payment methods
    const payment_methods = await PaymentMethod.find();
    // Get all discounts
    const discounts = await Discount.find();
    // Get all shipping companies
    const shipping_companies = await ShippingCompany.find();
    // Get all taxes
    const taxes = await Tax.find();
    // Find the tax with default: true
    const defaultTax = taxes.find(tax => tax.default === true);

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

    // // Use the find method to get the projects of the customer
    // const projects = await Project.find({customer_id: customer_id});
    // logger.log(projects);

    // Render the create invoices page
    res.render('invoices/create_invoice', { 
      user: user_settings,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      customers: customers, 
      products: products, 
      payment_methods: payment_methods, 
      discounts: discounts, 
      shipping_companies: shipping_companies, 
      taxes: taxes, 
      defaultTax: defaultTax,
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
      product_ids,
      product_quantities,
      product_ids_prices,
      discount_ids,
      discount_ids_amounts_totals,
      discount_ids_amounts_percentages,
      tax_id,
      tax_id_tax_percentage,
      tax_amount,
      shipping_amount: original_shipping_amount = 0,
      shipping_company_id,
      paid_on,
      paid_amount,
      payment_method_id,
      description,
      amount_total,
      amount_due,
      project_id,
      project_name,
      project_description,
      project_hour_rate,
      project_timeTracking,
      project_total_time,
    } = req.body;

    // Convert the string value to a number and if empty, it must be 0
    const shipping_amount = parseFloat(original_shipping_amount || 0);

    // Log or process the form fields as needed
    logger.log('Invoice Number:', invoice_number);
    logger.log('Customer ID:', customer_id);
    logger.log('Product IDs:', product_ids);
    logger.log('Product quantities:', product_quantities);
    logger.log('Product prices:', product_ids_prices);
    logger.log('Project ID:', project_id);
    logger.log('Project Name:', project_name);
    logger.log('Project Description:', project_description);
    logger.log('Project Hour Rate:', project_hour_rate);
    logger.log('Project Time Tracking:', project_timeTracking);
    logger.log('Project Total Time:', project_total_time);
    logger.log('Discount IDs:', discount_ids);
    logger.log('Discount Amounts Total', discount_ids_amounts_totals);
    logger.log('Discount Amounts Total', discount_ids_amounts_percentages);
    logger.log('Tax ID:', tax_id);
    logger.log('Tax Percentage:', tax_id_tax_percentage);
    logger.log('Tax Amount', tax_amount);
    logger.log('Shipping Amount:', shipping_amount);
    logger.log('Shipping Company ID:', shipping_company_id);
    logger.log('Paid On:', paid_on);
    logger.log('Paid Amount:', paid_amount);
    logger.log('Payment Method IDs:', payment_method_id);
    logger.log('Description:', description);
    logger.log('Amount Total:', amount_total);
    logger.log('Amount Due:', amount_due);


    // Get the product totals
    const product_totals = [];
    if (product_ids_prices) {
      for (let i = 0; i < product_ids_prices.length; i++) {
          const product_total = product_ids_prices[i] * product_quantities[i];
          product_totals.push(parseFloat(product_total));
      }
    }

    const status = "DRAFT";
    
    // Create products in right format with ids and quantities
    var products = [];
    for (let i = 0; i < product_ids.length; i++) {
      // Check if there are any products
      if (product_ids[0].length > 1) {
        products.push({
          id: product_ids[i],
          quantity: product_quantities[i]
        });
      }
    }

    // Create discounts in the right format
    var discounts = [];
    if (discount_ids[0] !== "") {
      for (let i = 0; i < discount_ids.length; i++) {
        discounts.push({
          id: discount_ids[i],
          total: discount_ids_amounts_totals[i],
          percentage: discount_ids_amounts_percentages[i],
        });
      }
   }

    logger.log("DISCOUNTS: ", discounts)

    // Create paid on in the right format
    var paid = [];
    if (paid_amount[0] !== "") {
      for (let i = 0; i < paid_on.length; i++) {
        paid.push({
          paid_on: formatDateToServerTimezone(paid_on[i], user_settings),
          paid_amount: paid_amount[i],
          payment_method_id: payment_method_id[i],
        });
      }
    }

    logger.log("PAID: ", paid);

    let project_timeTracking_json;
    if (project_timeTracking) {
      logger.log("project_timeTracking", project_timeTracking)
      project_timeTracking_json = JSON.parse(project_timeTracking)
    }

      
    try {
      // Save the invoice to the database
      const newInvoice = new Invoice({
        number: invoice_number,
        customer_id: customer_id[0],
        status: status,
        products: products,
        discounts: discounts,
        "tax.id": tax_id[0],
        "tax.total": tax_amount,
        "tax.percentage": tax_id_tax_percentage,
        "shipping.id": shipping_company_id[0],
        "shipping.amount": shipping_amount,
        paid: paid,
        amount_total: amount_total,
        amount_due: amount_due,
        description: description,
        "project_billed.id": project_id[0],
        "project_billed.name": project_name,
        "project_billed.description": project_description,
        "project_billed.total_time": project_total_time,
        "project_billed.hour_rate": project_hour_rate,
        "project_billed.timeTracking": project_timeTracking_json,
      });
      const savedInvoice = await newInvoice.save();
      res.redirect('/invoices/');
    } catch (error) {
      logger.error(error);
    
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

/* GET /invoices/create/projects. */
router.get('/projects/:id', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(!user) {
      // Render the login page
      return res.redirect('/login');
  }

  const customer_id = req.params.id;
    try {
      // Use the find method to get the user settings
      const user_settings = await User.findOne({ username: user.username });
      const projects = await Project.find({ customer_id: customer_id });
      const projectsWithTotalTime = [];
      const currentTime = new Date();
      projects.forEach(project => {
        const totalTimeInHours = formatTime(Math.round(calculateProjectTimeInSeconds(project)));
    
        // Map the timeTracking entries to the desired format
        const timeTrackingArray = project.timeTracking.map(entry => {
            let timePassed = Math.round((currentTime - entry.start) / 1000); // in seconds
            let stop = "";
            
            // Check if there's already a stop time, then format that time and change the timePassed
            if (entry.stop) {
                stop = entry.stop;
                timePassed = Math.round((entry.stop - entry.start) / 1000);
            }
            
            return {
                _id: entry._id,
                name: entry.name,
                start: entry.start,
                stop: stop,
                timePassed: formatTime(timePassed),
            };
        });
    
        // Create a new object with the project and its associated timeTrackingArray
        const projectWithTotalTime = {
            ...project.toObject({ virtuals: true }),
            totalTimeInHours,
            timeTracking: timeTrackingArray // Include the timeTrackingArray here
        };
    
        projectsWithTotalTime.push(projectWithTotalTime);

      });

      // Send the projects as a JSON response
      res.json(projectsWithTotalTime);
  } catch (error) {
      logger.error('Error:', error);
      // Handle errors and send an appropriate response
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET /invoices/create/projects. */
router.get('/project/:id/:hourRate', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(!user) {
      // Render the login page
      return res.redirect('/login');
  }

  const _id = req.params.id;
  try {
      const project = await Project.findOne({ _id: _id });
      const totalTimeInHours = (calculateProjectTimeInSeconds(project) / 60 / 60).toFixed(2);

      // Calculate the price of the project with the hour rate applied
      const hourRate = req.params.hourRate;
      const priceProject = totalTimeInHours * hourRate;

      // Send the price of the project as a JSON response
      res.json(priceProject);
  } catch (error) {
      logger.error('Error:', error);
      // Handle errors and send an appropriate response
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

function calculateProjectTimeInSeconds(project) {
      // Calculate the total time passed of all the time tracking
      // Calculate total seconds
      let totalSeconds = 0;
      project.timeTracking.forEach(timeEntry => {
          if (timeEntry.start && timeEntry.stop) {
              const startTime = new Date(timeEntry.start);
              const stopTime = new Date(timeEntry.stop);
              const timeDifferenceInSeconds = (stopTime - startTime) / 1000;
              totalSeconds += timeDifferenceInSeconds;
          }
      });
      const totalTimeInHours = totalSeconds;
      return totalTimeInHours;
}

module.exports = router;