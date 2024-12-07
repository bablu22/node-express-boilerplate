import * as fs from 'fs';
import * as path from 'path';
import { save, searchOne, updateAll } from '../repository';
import { Types } from 'mongoose';
import { ILogger } from '@/common/utils/logger';
import { RoleModelName as modelName } from '@/modules/role/role.model';

const dataPath = path.resolve(__dirname, './roles.jsonc');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const seed = async (logger: ILogger) => {
  await Promise.all(
    data.map(async (item: any) => {
      logger.info(`Checking if ${modelName} ${item.name} exists`);
      const itemExists = await searchOne({ name: item.name }, modelName);
      if (!itemExists) {
        const savedItem = await save(item, modelName);
        logger.info(`Saved role id: ${savedItem._id}`);
      } else {
        logger.info(`${modelName} ${item.name} already exists`);
      }
    })
  );
  logger.info(`Seeding ${modelName} finished`);
};

const migrate = async (logger: ILogger) => {
  logger.info(`Starting migration of ${modelName}`);
  const superadminUser = await searchOne({ username: 'superadmin' }, 'User');
  if (!superadminUser) {
    throw new Error(`Superadmin user not found`);
  }

  await updateAll(
    {
      $or: [
        { createdBy: { $exists: false } },
        { createdBy: new Types.ObjectId('303030303030303030303030') }
      ]
    },
    {
      createdBy: superadminUser._id,
      updatedBy: superadminUser._id
    },
    modelName
  );
  logger.info(`Migration of ${modelName} finished`);
};

export { seed, migrate };
