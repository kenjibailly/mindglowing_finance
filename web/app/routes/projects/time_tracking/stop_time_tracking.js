const express = require('express');
const router = express.Router();
const Project = require('../../../models/project');
const authenticateToken = require('../../security/authenticate');

// Handle the POST request to update a project and add time tracking
router.post('/:projectId/:timeTrackingId', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.projectId; // Use req.params.id to get the project ID from the route parameters
        const timeTrackingId = req.params.timeTrackingId;

        console.log(timeTrackingId);

        // Fetch the existing project by its ID
        const existingProject = await Project.findById(projectId);

        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Find the correct timeTracking entry within the timeTracking array
        const timeTrackingEntry = existingProject.timeTracking.find(entry => entry._id.toString() === timeTrackingId);

        if (!timeTrackingEntry) {
            return res.status(404).json({ message: 'Time tracking entry not found' });
        }

        // Update the stop time for the found timeTracking entry
        timeTrackingEntry.stop = new Date();

        // Save the updated project with the modified timeTracking entry
        await existingProject.save();

        res.redirect(`/projects/project/${projectId}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;