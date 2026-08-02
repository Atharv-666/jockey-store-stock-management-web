import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clothing_stock_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Non-fatal fallback for local testing if MongoDB daemon is not currently active
    if (process.env.NODE_ENV === 'development') {
      console.warn('Running in development mode without active MongoDB instance. Ensure MongoDB is running to execute DB queries.');
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;
