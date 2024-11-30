import { config } from '@/config/app.config';
import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to Mongo database');
  } catch (error) {
    console.log('Error connecting to Mongo database');
    process.exit(1);
  }
};

export default connectDatabase;
