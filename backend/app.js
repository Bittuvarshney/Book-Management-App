const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database')
require('dotenv').config();
const app = express();
const bookrouter = require("./routes/bookroute")

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/book",bookrouter)

// Routes
app.get('/', (req, res) => {
    res.send('Uber Project Backend is running!');
});

// TODO: Add more routes here

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

database()
// Start server

module.exports = app;