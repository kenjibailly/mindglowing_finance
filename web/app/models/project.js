const mongoose = require('mongoose');

// Define the projects schema
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    customer_id: String,
    timeTracking: [{
        name: String,
        time: Number,
        start: Date,
        stop: Date,
    }],
    description: String,
    created_on: {
        type: Date,
        default: Date.now,
    },
});

// Create a model using the schema
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;