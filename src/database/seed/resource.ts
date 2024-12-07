import { parse } from 'jsonc-parser';
import * as fs from 'fs';
import { save, searchOne, updateAll } from '../repository';
import { ILogger } from '@/common/utils/logger';
import { ResourceModelName as modelName } from '@/modules/resource/resource.model';

const resourcesData = fs.readFileSync(__dirname + '/resources.jsonc', 'utf8');

const seed = async (logger: ILogger) => {
  const data = parse(resourcesData);
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
  logger.info(`${modelName} seeding finished`);
};

const migrate = async (logger: ILogger) => {
  logger.info(`${modelName} starting`);
  const superadminUser = await searchOne({ username: 'superadmin' }, 'User');
  if (!superadminUser) {
    throw new Error('Superadmin user not found');
  }

  await updateAll(
    {},
    {
      createdBy: superadminUser._id,
      updatedBy: superadminUser._id
    },
    modelName
  );
  logger.info(`${modelName} seeding finished`);
};

export { seed, migrate };
