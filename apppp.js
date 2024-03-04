const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Function to read users from the text file
function readUsersFromFile() {
    const filePath = path.join(__dirname, 'users.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const users = lines.map(line => {
        const [username, password] = line.split(',');
        return { username, password };
    });
    return users;
}

// Authenticate user
function authenticateUser(username, password) {
    const users = readUsersFromFile();
    return users.find(user => user.username === username && user.password === password);
}

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the login system. Please <a href="/login">login</a>.');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (authenticateUser(username, password)) {
        req.session.user = username;
        res.redirect('/profile');
    } else {
        res.send('Invalid username or password. <a href="/login">Try again</a>.');
    }
});

app.get('/profile', (req, res) => {
    const user = req.session.user;
    if (user) {
        res.send(`Welcome, ${user}! <a href="/logout">Logout</a>`);
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
