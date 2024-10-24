const express = require('express');
const router = express.Router();
const Project = require('../../models/project');
const authenticateToken = require('../security/authenticate');

// Handle the delete request for selected projects
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Delete the selected projects in the database
        const result = await Project.deleteMany({ _id: { $in: selectedIds } });
  
        if (!result.deletedCount) {
            return res.status(404).send('No projects found for deletion');
        }
  
        // Send a JSON response with a success message
        res.status(200).json({ message: 'Projects deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  
module.exports = router;