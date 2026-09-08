import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas/Database successfully.');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('⚠️ Running in development mode without DB connection yet. Set MONGODB_URI in .env');
    }
  }
}
