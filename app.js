const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs'); // Add this line to import the EJS module

const app = express();

// Middleware setup...
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Define routes
app.get('/', (req, res) => {
    res.send('Welcome to the login system. Please <a href="/login">login</a>.');
});

app.get('/login', (req, res) => {
    // Form to login
    res.send(`
        <form method="post" action="/login">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login', (req, res) => {
    // Handle login logic
    const { username, password } = req.body;
    if (username === 'user' && password === 'password') {
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
