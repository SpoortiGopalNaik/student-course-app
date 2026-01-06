const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

// 🟦 PROMETHEUS METRICS SETUP
const client = require('prom-client');
client.collectDefaultMetrics(); // collects CPU, RAM, event loop, uptime, etc.

// /metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// 🟩 MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🟦 EJS setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// 🟦 Session setup
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// 🟦 Make user available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// 🟦 Routes
app.use('/', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));

// 🏠 Home route
app.get('/', (req, res) => {
  res.render('login', { title: 'Home', error: null });
});

// 🟢 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
