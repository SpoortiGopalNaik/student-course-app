// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  try {
    if (!email || !password) return res.render('login', { title: 'Login', error: 'Please enter email and password' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.render('login', { title: 'Login', error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('login', { title: 'Login', error: 'Invalid credentials' });

    // Save minimal user info in session
    req.session.user = { id: user._id, name: user.name, email: user.email };
    return res.redirect('/courses');
  } catch (err) {
    console.error('Login error:', err);
    return res.render('login', { title: 'Login', error: 'Something went wrong' });
  }
});

// GET /register
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', error: null });
});

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  try {
    if (!name || !email || !password) return res.render('register', { title: 'Register', error: 'Please fill all fields' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.render('register', { title: 'Register', error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed });
    await user.save();

    // auto-login
    req.session.user = { id: user._id, name: user.name, email: user.email };
    return res.redirect('/courses');
  } catch (err) {
    console.error('Registration error:', err);
    return res.render('register', { title: 'Register', error: 'Something went wrong' });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
