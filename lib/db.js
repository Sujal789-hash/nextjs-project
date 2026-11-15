import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextmatch';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isMock: false };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500, // Quick timeout to fall back cleanly if local mongo is not running
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB successfully.');
      return mongooseInstance;
    }).catch((err) => {
      console.warn('⚠️ MongoDB connection failed, falling back to mock database storage:', err.message);
      cached.isMock = true;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.isMock = true;
    console.warn('⚠️ MongoDB connection failed on await, falling back to mock database storage.');
  }

  return cached.conn;
}

export default connectToDatabase;

