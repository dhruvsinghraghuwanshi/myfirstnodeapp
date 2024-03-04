const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware setup...
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Function to read users from the text file
// Function to read users from the text file
function readUsersFromFile() {
    const filePath = path.join(__dirname, 'users.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const users = lines.map(line => {
        const [username, password] = line.split(',');
        return { username, password: password.trim() }; // Trim whitespace from password
    });
    return users;
}


// Authenticate user
// Authenticate user
function authenticateUser(username, password) {
    const users = readUsersFromFile();
    console.log('Input username:', username);
    console.log('Input password:', password);
    console.log('Users:', users); // Log the entire users array
    const authenticatedUser = users.find(user => user.username === username && user.password === password);
    console.log('Authenticated user:', authenticatedUser); // Log the authenticated user
    return authenticatedUser;
}

// Define routes
app.get('/', (req, res) => {
    res.send('Welcome to the login system. Please <a href="/login">login</a>.');
});

app.get('/login', (req, res) => {
    // Form to login
    res.render(path.join(__dirname, 'frontend', 'login.ejs'));
});

app.post('/login', (req, res) => {
    // Handle login logic
    const { username, password } = req.body;
    if (authenticateUser(username, password)) {
        req.session.user = username;
        res.redirect('/profile');
    } else {
        res.send('Invalid username or password. <a href="/login">Try again</a>.');
    }
});

app.get('/profile', (req, res) => {
    // Display user profile
    const user = req.session.user;
    if (user) {
        // Render the EJS template from the frontend folder and pass user data
        res.render(path.join(__dirname, 'frontend', 'index.ejs'), { user: user });
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    // Handle logout logic
    req.session.destroy();
    res.redirect('/login');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
