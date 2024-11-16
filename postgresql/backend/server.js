const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
//const dotenv = require("dotenv");

//dotenv.config(); // Load environment variables from .env

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
    connectionString: "postgresql://postgres.scapzmmddiwdkpjhhxuo:Nilesh13122@@aws-0-ap-southeast-1.pooler.supabase.com:6543/college" , // Use your database URL here
    ssl:false
});


// Middleware
app.use(bodyParser.json());
app.use(express.static('../frontend')); 


// Endpoint to check database connection
app.get('/*', async (req, res) => {
    try {
        // Test the connection
        const client = await pool.connect();
        //res.send('Database is connected successfully!');
        console.log('database connected'); 
        client.release(); // Release the client back to the pool
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).send('Failed to connect to the database.');
    }
});


// Login endpoint
app.post("/login", async (req, res) => {

try {
        // Test the connection
        const client = await pool.connect();
        //res.send('Database is connected successfully!');
        console.log('database connected'); 
        //  client.release(); // Release the client back to the pool
            } catch (err) {
        console.error('Database connection error:', err);
        //res.status(500).send('Failed to connect to the database.');
    }


    const { id, name, roll, age, marks } = req.body;

    try {
        const query = `
            SELECT * FROM student 
            WHERE id = $1 AND name = $2 AND roll = $3 AND age = $4 AND marks = $5
        `;
        const values = [id, name, roll, age, marks];

        const result = await pool.query(query, values);

       

        if (result.rows.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error("Error validating user:", error);
        res.status(500).json({ success: false });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
