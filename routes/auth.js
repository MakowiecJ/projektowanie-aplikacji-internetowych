const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Rejestracja
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Create a token
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, { expiresIn: '1h' });

    // Set token in a cookie
    res.cookie('token', token, { httpOnly: true });

    // Redirect to home page
    res.redirect('/');
});

// Logowanie
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }

    // Create a token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });

    // Set token in a cookie
    res.cookie('token', token, { httpOnly: true });

    // Redirect to home page
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.redirect('/'); // Redirect to home page or login page
});


// Formularz rejestracji
router.get('/register', (req, res) => {
    res.render('auth/register');
  });
  
// Formularz logowania
router.get('/login', (req, res) => {
res.render('auth/login');
});

module.exports = router;
