const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const database = require('./database');
require('dotenv').config();

const app = express();
const bookrouter = require("./routes/bookroute");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/book", bookrouter);

// Serve React build
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api", (req, res) => {
    res.send("Backend API is running!");
});

// React routes
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

database();

module.exports = app;