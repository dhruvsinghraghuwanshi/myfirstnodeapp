// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_system'
});

// Test the database connection
pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to the database!');
    connection.release(); // Release the connection
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the login system. Please <a href="/login">login</a>.');
});

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    pool.query('INSERT INTO login (username, password) VALUES (?, ?)', [username, password], (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).send('Error registering user');
        }

        console.log('User registered successfully');
        res.send('User registered successfully');
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error authenticating user:', err);
            return res.status(500).send('Error authenticating user');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        console.log('User authenticated successfully');
        res.send('User authenticated successfully');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
