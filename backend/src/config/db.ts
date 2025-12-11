// src/config/db.ts
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      autoIndex: true
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
