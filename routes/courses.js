// routes/courses.js
const express = require('express');
const Course = require('../models/course');
const Registration = require('../models/registration');
const User = require('../models/user');
const router = express.Router();

// Middleware - require login
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// GET /courses - list courses
router.get('/', requireLogin, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    // also find user's registrations to mark which are already registered
    const regs = await Registration.find({ user: req.session.user.id }).select('course');
    const registeredCourseIds = regs.map(r => String(r.course));
    res.render('courses', { title: 'Courses', courses, registeredCourseIds });
  } catch (err) {
    console.error('Courses list error:', err);
    res.send('Error loading courses');
  }
});

// POST /courses/register - register current user for a course
router.post('/register', requireLogin, async (req, res) => {
  const userId = req.session.user.id;
  const { courseId } = req.body || {};
  if (!courseId) return res.redirect('/courses');

  try {
    // ensure course exists
    const course = await Course.findById(courseId);
    if (!course) return res.redirect('/courses');

    // create registration (unique index prevents duplicates)
    const reg = new Registration({ user: userId, course: courseId });
    await reg.save();

    return res.redirect('/courses');
  } catch (err) {
    // if duplicate key error (already registered) -> ignore and redirect
    if (err.code === 11000) {
      return res.redirect('/courses');
    }
    console.error('Registration error:', err);
    return res.send('Something went wrong while registering for the course.');
  }
});

module.exports = router;
