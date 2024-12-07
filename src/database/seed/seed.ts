import mongoose from 'mongoose';
import { seed as seedResources } from './resource';
import { seed as seedRoles } from './role';
import { seed as seedUsers } from './users';
import { seed as seedPermissions } from './permissions';
import { logger } from '@/common/utils/logger';
import config from '@/config/app.config';

logger.info('Seed starting');

const seed = async () => {
  try {
    logger.info('Connecting to database');
    await mongoose.connect(config.MONGO_URI);
    logger.info('Connected to MongoDB');

    await seedResources(logger);
    await seedRoles(logger);
    await seedUsers(logger);
    await seedPermissions(logger);
    // await seedProducts(logger);

    logger.info(`Seed finished`);
    // exit process
    process.exit(0);
  } catch (error) {
    if (config.NODE_ENV === 'development') {
      console.log(error);
    }
    logger.error(JSON.stringify(error));
    process.exit(0);
  }
};

seed();
logger.info(`Seed finished`);
