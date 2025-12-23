import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('DB Connected');
  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1);
  }
};
