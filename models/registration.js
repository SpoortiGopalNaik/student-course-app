// models/registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensure user + course pair is unique
registrationSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
