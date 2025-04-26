// server.js - Main Express server for handling the contact form API endpoint
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool, initializeDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

// Initialize database tables
initializeDb();

// API endpoint for contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and message'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Save to database
        const query = 'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id';
        const values = [name, email, message];

        const result = await pool.query(query, values);

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
});

// Start server
// At the bottom of your server.js file, replace the current app.listen block with this:
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying port ${port + 1}...`);
            server.close();
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

startServer(PORT);