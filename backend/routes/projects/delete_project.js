const express = require('express');
const router = express.Router();
const Project = require('../../models/project');
const authenticateToken = require('../security/authenticate');

// Handle the update request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
  
        // Find the project to get the image file name
        const project = await Project.findById(projectId);
  
        if (!project) {
            return res.status(404).send('Project not found');
        }
        
  
        // Update the project in the database
        const result = await Project.findByIdAndDelete(projectId);
  
        if (!result) {
            return res.status(404).send('Project not found');
        }
  
        // Redirect to the projects page
        res.redirect(`/projects/`);
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;