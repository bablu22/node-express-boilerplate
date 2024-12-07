import { logger } from '@/common/utils/logger';
import config from '@/config/app.config';
import mongoose from 'mongoose';
import { migrate as userMigrate } from './users';
import { migrate as resourceMigrate } from './resource';
import { migrate as roleMigrate } from './role';
import { migrate as permissionMigrate } from './permissions';

const migrate = async () => {
  logger.info('Connecting to database');
  await mongoose.connect(config.MONGO_URI);
  logger.info('Connected to MongoDB');
  await userMigrate(logger);
  await roleMigrate(logger);
  await resourceMigrate(logger);
  await permissionMigrate(logger);
  logger.info(`Migration finished`);
  process.exit(0);
};

migrate();
