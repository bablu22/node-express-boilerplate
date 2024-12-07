import { AppError } from '@/common/utils/AppError';
import { TMeta } from '@/common/utils/sendResponse';
import QueryBuilder from '@/database/Query';
import { Request } from 'express';
import httpStatus from 'http-status';
import { IPermission } from './permission.interface';
import Permission from './permission.model';
import Resource from '../resource/resource.model';
import Role from '../role/role.model';

const getAllPermission = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; result: IPermission[] }> => {
  const PermissionSearchableFields: (keyof IPermission)[] = [
    'roleName',
    'resourceName',
    'isAllowed',
    'isDisabled'
  ];

  const queryBuilder = new QueryBuilder<IPermission>(Permission, {
    ...query,
    populate: {
      path: 'createdBy',
      select: 'name email'
    }
  });

  const result = await queryBuilder.search(PermissionSearchableFields).paginate().execute();

  return {
    meta: result.meta,
    result: result.data
  };
};

const getPermissionById = async (id: string): Promise<IPermission> => {
  const permission = await Permission.findOne({ _id: id });
  if (!permission) {
    throw new AppError('This Permission is not found', httpStatus.NOT_FOUND);
  }
  return permission;
};

const createPermission = async (req: Request): Promise<IPermission> => {
  const userId = req.user?.id;
  const { roleId, resourceId } = req.body;

  const isResourceExist = await Resource.findOne({
    _id: resourceId
  });

  const isRoleExist = await Role.findOne({ _id: roleId });
  if (!isRoleExist) {
    throw new AppError('This Role does not exist', httpStatus.BAD_REQUEST);
  }

  const result = await Permission.create({
    ...req.body,
    createdBy: userId,
    updatedBy: userId,
    roleId: isRoleExist._id,
    roleName: isRoleExist.name,
    roleAlias: isRoleExist.alias,
    resourceId: isResourceExist?._id,
    resourceName: isResourceExist?.name,
    resourceAlias: isResourceExist?.alias
  });
  return result;
};

const updatePermission = async (id: string, req: Request): Promise<IPermission | null> => {
  const permission = await Permission.findOne({ _id: id });
  if (!permission) {
    throw new AppError('This Permission does not exist', httpStatus.NOT_FOUND);
  }

  const { ...remainingData } = req.body;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData
  };

  const result = await Permission.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true
  });

  return result;
};

const deletePermission = async (id: string): Promise<null> => {
  const permission = await Permission.findOne({ _id: id });
  if (!permission) {
    throw new AppError('This Permission is not found', httpStatus.NOT_FOUND);
  }

  await Permission.findByIdAndDelete(id);

  return null;
};

export const PermissionService = {
  getAllPermission,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
};
