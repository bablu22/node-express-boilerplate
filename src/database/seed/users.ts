import { ILogger } from '@/common/utils/logger';
import { userService } from '@/modules/user/user.service';
import { searchOne, update, updateAll } from '../repository';

import * as fs from 'fs';
import * as path from 'path';
import { IUser } from '@/modules/user/user.interface';

const dataPath = path.resolve(__dirname, './users.jsonc');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const seed = async (logger: ILogger) => {
  await Promise.all(
    data.map(async (user: Partial<IUser>) => {
      logger.info(`Checking if user ${user.username} exists`);
      const userExists = await searchOne({ username: user.username }, 'User');
      if (!userExists) {
        const role = await searchOne({ alias: user.roleAlias }, 'Role');
        const savedUser = await userService.createUser({
          ...user,
          roleId: role._id
        });
        logger.info(`Saved user id: ${savedUser._id}`);
      } else {
        logger.info(`User ${user.username} already exists`);
      }
    })
  );
  logger.info(`Seeding users finished`);
};

const migrate = async (logger: ILogger) => {
  logger.info('User starting');
  const superadminUser = await searchOne({ username: 'superadmin' }, 'User');
  if (!superadminUser) {
    throw new Error('Superadmin user not found');
  }

  const adminRole = await searchOne({ name: 'admin' }, 'Role');
  if (!adminRole) {
    throw new Error('Admin role not found');
  }

  const superadminRole = await searchOne({ name: 'superadmin' }, 'Role');
  if (!adminRole) {
    throw new Error('Superadmin role not found');
  }

  const response = await updateAll(
    // { createdBy: { $exists: false } },
    {},
    {
      createdBy: superadminUser._id,
      updatedBy: superadminUser._id,
      roleId: adminRole._id,
      roleAlias: adminRole.alias,
      isActive: true
    },
    'User'
  );
  logger.info(`Migrated ${response.nModified} users`);
  const saUpdateResponse = await update(
    {},
    {
      ...superadminUser,
      roleId: superadminRole._id,
      roleAlias: superadminRole.alias,
      createdBy: superadminUser._id,
      updatedBy: superadminUser._id
    },
    'User'
  );
  logger.info(`Migrated superadmin user ${saUpdateResponse.nModified}`);
  return response;
};

export { seed, migrate };
