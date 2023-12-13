const express = require('express');
const router = express.Router();
const Item = require('../../models/item');
const authenticateToken = require('../security/authenticate');
const upload = require('../picture_handler/multerConfig');

/* GET /items/create-item page. */
router.get('/', authenticateToken, function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    
    // Render the create items page
    res.render('items/create_item', { username: user.username });

});

// Handle the POST request to add an item
router.post('/', authenticateToken, upload.single('picture'), async (req, res) => {
    // Extract form data from the request
    const { name, price, description } = req.body;

    // Check if a file was uploaded
    const picture = req.file ? `${req.file.filename}` : null;


    // Create a new item instance with the form details
    const newItem = new Item({
        name,
        price,
        description,
        picture,
    });

    try {
        // Save the item to the database
        const savedItem = await newItem.save();
        res.redirect('/items');
    } catch (error) {
        console.error(error);

        // Check if the error is a duplicate key violation
        if (error.code === 11000 && error.keyPattern && error.keyPattern['name']) {
            // Duplicate name error
            res.status(400).json({ message: 'Item with the same name already exists' });
        } else {
            // Other internal server error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

module.exports = router;