import 'dotenv/config';
import config from '@config/app.config';
import mongoose from 'mongoose';
import chalk from 'chalk';
const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(chalk.black.bgWhite('🗄️ Connected to Mongo database ✅ '));
    return mongoose.connection;
  } catch (error) {
    console.log(chalk.white.bgRed(error || 'Error connecting to Mongo database'));
    process.exit(1);
  }
};

export default connectDatabase;
