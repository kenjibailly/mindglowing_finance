const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const authenticateToken = require('../security/authenticate');

/* GET /customers page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    
    // Use the find method to get all customers
    const customers = await Customer.find().lean();
    // Loop through the customers array and update the format of the created_on field
    const updatedCustomers = customers.map((customer) => {
      return {
        ...customer,
        created_on: customer.created_on.toLocaleDateString('en-GB'), // Change the locale based on your requirements
      };
    });
    // Render the customers page
    res.render('customers/customers', { username: user.username, customers: updatedCustomers});

});

// Get the customer page by id
router.get('/edit/:id', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.render('login');
    }
    try {
      // Use the find method to get all customers
      const customer = await Customer.findById(req.params.id);
      // Render the customers page
      res.render('customers/customer', { username: user.username, customer: customer });
    } catch (error) {
      console.error(error);
      res.render('customers/customers', { username: user.username});
  }
});


// Handle the update request
router.post('/edit/:id', authenticateToken, async (req, res) => {
  try {
      const customerId = req.params.id;
      const updatedCustomer = req.body; // Assuming req.body contains the updated customer details

      // Perform any validation or additional processing as needed

      // Update the customer in the database
      const result = await Customer.findByIdAndUpdate(customerId, updatedCustomer, { new: true });

      if (!result) {
          return res.status(404).send('Customer not found');
      }

    // Get the user
    const user = req.session.user;
    // Get the customer
    const customer = await Customer.findById(req.params.id);
    // Render the customer again with a success message
    res.render('customers/customer', { success: 'true', username: user.username, customer: customer });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// Handle the update request
router.post('/delete/:id', authenticateToken, async (req, res) => {
  try {
      const customerId = req.params.id;

      // Perform any validation or additional processing as needed

      // Update the customer in the database
      const result = await Customer.findByIdAndDelete(customerId);

      if (!result) {
          return res.status(404).send('Customer not found');
      }

      // Redirect to the customers page
      res.redirect(`/customers/`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// Handle the delete request for selected customers
router.post('/delete-selected/', authenticateToken, async (req, res) => {
  try {
      // Extract selected IDs from the request body
      const selectedIds = req.body.selectedIds;

      // Delete the selected customers in the database
      const result = await Customer.deleteMany({ _id: { $in: selectedIds } });

      if (!result.deletedCount) {
          return res.status(404).send('No customers found for deletion');
      }

      // Send a JSON response with a success message
      res.status(200).json({ message: 'Customers deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


module.exports = router;