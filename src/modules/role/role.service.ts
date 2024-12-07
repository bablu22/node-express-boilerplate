import { Request } from 'express';
import Role from './role.model';
import httpStatus from 'http-status';
import { AppError } from '@/common/utils/AppError';
import { IRole } from './role.interface';
import { TMeta } from '@/common/utils/sendResponse';
import QueryBuilder from '@/database/Query';

const getAllRole = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; result: IRole[] }> => {
  const RoleSearchableFields: (keyof IRole)[] = ['name', 'alias'];

  const queryBuilder = new QueryBuilder<IRole>(Role, {
    ...query,
    populate: [
      {
        path: 'createdBy',
        select: 'name email'
      },
      {
        path: 'updatedBy',
        select: 'name email'
      },
      {
        path: 'permissions'
      }
    ]
  });

  const result = await queryBuilder
    .search(RoleSearchableFields)
    .paginate()
    .fields()
    .sort()
    .execute();

  return {
    meta: result.meta,
    result: result.data
  };
};

const getRoleById = async (id: string): Promise<IRole> => {
  const role = await Role.findOne({ _id: id });
  if (!role) {
    throw new AppError('This Role is not found', httpStatus.NOT_FOUND);
  }
  return role;
};

const createRole = async (req: Request): Promise<IRole> => {
  const userId = req.user?.id;

  const result = await Role.create({
    ...req.body,
    createdBy: userId,
    updatedBy: userId
  });
  return result;
};

const updateRole = async (id: string, req: Request): Promise<IRole | null> => {
  const role = await Role.findOne({ _id: id });
  if (!role) {
    throw new AppError('This Role does not exist', httpStatus.NOT_FOUND);
  }

  const { ...remainingData } = req.body;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData
  };

  const result = await Role.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true
  });

  return result;
};

const deleteRole = async (id: string): Promise<null> => {
  const role = await Role.findOne({ _id: id });
  if (!role) {
    throw new AppError('This Role is not found', httpStatus.NOT_FOUND);
  }

  await Role.findByIdAndDelete(id);

  return null;
};

export const RoleService = {
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
