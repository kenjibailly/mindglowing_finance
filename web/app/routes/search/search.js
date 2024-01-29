const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const Invoice = require('../../models/invoice');
const Product = require('../../models/product');
const Project = require('../../models/project');
const Customization = require('../../models/customization');

// Define a route for searching across collections
router.get('/', async (req, res) => {
  const searchTerm = req.query.q;

  try {
    // Search in the Customer collection
    const customers = await Customer.find({
      $or: [
        { 'personal_information.first_name': new RegExp(searchTerm, 'i') },
        { 'personal_information.last_name': new RegExp(searchTerm, 'i') },
        { 'personal_information.email': new RegExp(searchTerm, 'i') },
        // Add other fields as needed
      ],
    });

    // Use the find method to get the customization settings
    const customization_settings = await Customization.findOne();
    const invoicePrefix = customization_settings.invoice_prefix + customization_settings.invoice_separator;

    const searchTermWithoutPrefix = searchTerm.startsWith(invoicePrefix) ? searchTerm.substring(4) : searchTerm;

    // Search in the Invoice collection
    const invoices = await Invoice.find({
      $or: [
        { number: isNaN(searchTermWithoutPrefix) ? null : searchTermWithoutPrefix },
        { description: new RegExp(searchTerm, 'i') },
        // Add other fields as needed
      ],
    });

    // Search in the Product collection
    const products = await Product.find({
      $or: [
        { name: new RegExp(searchTerm, 'i') },
        { description: new RegExp(searchTerm, 'i') },
        // Add other fields as needed
      ],
    });

    // Search in the Product collection
    const projects = await Project.find({
      $or: [
        { name: new RegExp(searchTerm, 'i') },
        { description: new RegExp(searchTerm, 'i') },
        // Add other fields as needed
      ],
    });

    // Set the search results in res.locals
    res.render('partials/search-results-popup', { 
      search_results: { customers, products, invoices, projects },
      customization_settings: customization_settings,
    });

  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;