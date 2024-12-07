import { parse } from 'jsonc-parser';
import * as fs from 'fs';
import { save, searchOne, update, updateAll } from '../repository';
import { Types } from 'mongoose';
import { ILogger } from '@/common/utils/logger';
import { PermissionModelName as permissionModel } from '@/modules/permission/permission.model';
import { ResourceModelName as resourceModel } from '@/modules/resource/resource.model';

const permissionsData = fs.readFileSync(__dirname + '/permissions.jsonc', 'utf8');

const seed = async (logger: ILogger) => {
  const data = parse(permissionsData);
  await Promise.all(
    data.map(async (item: any) => {
      logger.info(`Checking if permission ${item.resourceName} for ${item.roleName} exists`);
      const itemExists = await searchOne(
        { resourceName: item.resourceName, roleName: item.roleName },
        permissionModel
      );
      if (!itemExists) {
        const role = await searchOne({ name: item.roleName }, 'Role');
        const resource = await searchOne({ name: item.resourceName }, resourceModel);
        try {
          const savedItem = await save(
            {
              ...item,
              roleId: role._id,
              resourceId: resource._id
            },
            permissionModel
          );
          logger.info(`Saved permission id: ${savedItem._id}`);
        } catch (error) {
          logger.error(JSON.stringify(error));
        }
      } else {
        const updatedItem = await update({ _id: itemExists._id }, { ...item }, permissionModel);
        logger.info(
          `Permission ${item.resourceName} for ${item.roleName} of id ${updatedItem._id} is updated`
        );
      }
    })
  );
  logger.info(`Seeding users finished`);
};

const migrate = async (logger: ILogger) => {
  logger.info(`Starting migration of permissions`);
  const superadminUser = await searchOne({ username: 'superadmin' }, 'User');
  if (!superadminUser) {
    throw new Error('Superadmin user not found');
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
    permissionModel
  );
  logger.info(`Migration of permissions finished`);
};

export { seed, migrate };
