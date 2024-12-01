import config from '@config/app.config';
import mongoose from 'mongoose';
import chalk from 'chalk';

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(chalk.black.bgWhite(' Connected to Mongo database ✅ '));
  } catch (error) {
    console.log(chalk.red.bgRed('Failed to connect to Mongo database'));
    process.exit(1);
  }
};

export default connectDatabase;
