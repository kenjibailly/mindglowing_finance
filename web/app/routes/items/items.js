const express = require('express');
const router = express.Router();
const Item = require('../../models/item');
const authenticateToken = require('../security/authenticate');
const deleteImageFile = require('../picture_handler/deleteImageFile')
const upload = require('../picture_handler/multerConfig');

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
    const items = await Item.find().lean();
    res.render('items/items', { username: user.username, items: items});

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
      const item = await Item.findById(req.params.id);
      // Render the items page
      res.render('items/item', { username: user.username, item: item });
    } catch (error) {
      console.error(error);
      res.render('items/items', { username: user.username});
  }
});


// Handle the update request
router.post('/edit/:id', authenticateToken, upload.single('picture'), async (req, res) => {
  try {
      const itemId = req.params.id;
      const { name, price, description } = req.body;

      // Find the item to get the image file name
      const old_item = await Item.findById(itemId);

      if (!old_item) {
          return res.status(404).send('Item not found');
      }

      console.log(req.file)

      var picture;
      // Check if a file was uploaded
      if(req.file) {
        picture = req.file ? `${req.file.filename}` : null;
      // Otherwise keep the old picture
      } else {
        picture = old_item.picture;
      }

      // If the item had a picture and there's a new one
      if(old_item.picture && req.file) {
        // Delete the image file
        await deleteImageFile(old_item.picture);
      }

      // Update the item in the database
      const result = await Item.findByIdAndUpdate(
        itemId,
        { $set: { name, price, description, picture } },
        { new: true }
      );

      if (!result) {
          return res.status(404).send('Item not found');
      }
    
    // Get the user
    const user = req.session.user;
    // Get the item
    const item = await Item.findById(req.params.id);
    // Render the item again with a success message
    res.render('items/item', { success: 'true', username: user.username, item: item });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// Handle the update request
router.post('/delete/:id', authenticateToken, async (req, res) => {
  try {
      const itemId = req.params.id;

      // Find the item to get the image file name
      const item = await Item.findById(itemId);

      if (!item) {
          return res.status(404).send('Item not found');
      }

      // If the item had a picture
      if(item.picture) {
        // Delete the image file
        await deleteImageFile(item.picture);
      }
      

      // Update the item in the database
      const result = await Item.findByIdAndDelete(itemId);

      if (!result) {
          return res.status(404).send('Item not found');
      }

      // Redirect to the items page
      res.redirect(`/items/`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// Handle the delete request for selected items
router.post('/delete-selected/', authenticateToken, async (req, res) => {
  try {
      // Extract selected IDs from the request body
      const selectedIds = req.body.selectedIds;

      // Find the items to get the image file names
      const items = await Item.find({ _id: { $in: selectedIds } });

      // Delete the image files
      await Promise.all(items.map(item => deleteImageFile(item.picture)));


      // Delete the selected items in the database
      const result = await Item.deleteMany({ _id: { $in: selectedIds } });

      if (!result.deletedCount) {
          return res.status(404).send('No items found for deletion');
      }

      // Send a JSON response with a success message
      res.status(200).json({ message: 'Items deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;