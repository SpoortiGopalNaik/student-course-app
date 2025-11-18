// users.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const name = 'Test User';
  const email = 'test@example.com';
  const password = 'Test1234';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User already exists:', email);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();
  console.log('Created user:', email);
  await mongoose.disconnect();
}

createUser().catch(err => {
  console.error(err);
  process.exit(1);
});
