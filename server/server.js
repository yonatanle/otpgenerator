const express = require('express');
//const sqlite3 = require('sqlite3').verbose(); // Import SQLite
const cors = require('cors');
const otpRoutes = require('./routes/otpRoutes'); // Ensure that this file exists
const otp_table = require('./database/otp_table');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const db = otp_table.createDataSource();
// Routes
app.use('/api/otp', otpRoutes(db)); // Pass the SQLite database object to routes

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
