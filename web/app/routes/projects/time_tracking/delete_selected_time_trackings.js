const express = require('express');
const router = express.Router();
const Project = require('../../../models/project');
const authenticateToken = require('../../security/authenticate');

// Handle the delete request for selected time trackings
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const selectedIds = req.body.selectedIds;

        // Find the project by ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Filter out the selected time trackings
        const updatedTimeTracking = project.timeTracking.filter(
            (tracking) => !selectedIds.includes(tracking._id.toString())
        );

        // Update the project with the modified time tracking array
        const result = await Project.findByIdAndUpdate(
            projectId,
            { $set: { timeTracking: updatedTimeTracking } },
            { new: true }
        );

        if (!result) {
            return res.status(404).send('Project not found');
        }

        // Send a JSON response with a success message
        res.status(200).json({ message: 'Time trackings deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;