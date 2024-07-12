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
    res.status(201).send('User registered');
});

// Logowanie
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET);
    res.json({ token });
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
