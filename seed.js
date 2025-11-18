// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/course');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for seeding');

  const courses = [
    { title: 'Introduction to Web Development', description: 'HTML, CSS, JavaScript basics' },
    { title: 'Node.js and Express', description: 'Build backend APIs using Node.js and Express' },
    { title: 'Database Essentials (MongoDB)', description: 'CRUD, indexing, aggregation basics' }
  ];

  await Course.deleteMany({});
  await Course.insertMany(courses);
  console.log('Seeded courses.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
