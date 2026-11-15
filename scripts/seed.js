// Node.js direct seed script
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pitchconnect';

async function seed() {
  console.log('Connecting to:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! (Run via API endpoint /api/seed in Next.js runtime)');
    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Seed connection notice:', err.message);
  }
}

seed();

