const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 3000;

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.SUPABASE_DBURI,
    ssl:false
});

// Check and log the database connection status
pool.connect((err, client, release) => {
    if (err) {
        console.error("Database connection failed!", err.stack);
    } else {
        console.log("Database connected successfully!");
        release();
    }
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../client/public")));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/views"));

// Route to render the form
app.get("/", (req, res) => {
    res.render("htmlform");
});

// Route to validate user details
app.post("/validate", async (req, res) => {
    const { id, name, roll, age, marks } = req.body;

    try {
        // Query to check if the record exists in the database
        const query = `
            SELECT * 
            FROM student 
            WHERE id = $1 AND name = $2 AND roll = $3 AND age = $4 AND marks = $5
        `;
       
        const values = [id, name, roll, age, marks];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.send(`
                <h1>Record Found</h1>
                <p><b>ID:</b> ${id}</p>
                <p><b>Name:</b> ${name}</p>
                <p><b>Roll:</b> ${roll}</p>
                <p><b>Age:</b> ${age}</p>
                <p><b>Marks:</b> ${marks}</p>
            `);
        } else {
            res.status(404).send(`
                <h1>Record Not Found</h1>
                <p>No record matches the provided details.</p>
            `);
        }
    } catch (error) {
        console.error("Error validating record:", error);
        res.status(500).send(`
            <h1>Server Error</h1>
            <p>There was a problem processing your request. Please try again later.</p>
        `);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
