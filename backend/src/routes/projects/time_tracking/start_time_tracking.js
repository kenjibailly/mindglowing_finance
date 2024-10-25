const express = require('express');
const router = express.Router();
const Project = require('../../../models/project');
const authenticateToken = require('../../security/authenticate');

// Handle the POST request to update a project and add time tracking
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        // Extract form data from the request
        const { 
            time_tracking_name
        } = req.body;

        // Fetch the existing project by its ID
        const existingProject = await Project.findById(projectId);

        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Create a new time tracking entry with the current date and time
        const currentTimeTracking = {
            name: time_tracking_name,
            start: new Date(),
        };

        // Add the new time tracking entry to the project
        existingProject.timeTracking.push(currentTimeTracking);

        // Save the updated project with the new time tracking entry
        await existingProject.save();

        res.redirect(`/projects/project/${projectId}`);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;