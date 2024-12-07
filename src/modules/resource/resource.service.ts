import { Request } from 'express';
import Resource from './resource.model';
import httpStatus from 'http-status';
import { AppError } from '@/common/utils/AppError';
import { IResource } from './resource.interface';
import { TMeta } from '@/common/utils/sendResponse';
import QueryBuilder from '@/database/Query';

const getAllResource = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; result: IResource[] }> => {
  const ResourceSearchableFields: (keyof IResource)[] = ['name', 'alias', 'type'];

  const queryBuilder = new QueryBuilder<IResource>(Resource, {
    ...query,
    populate: {
      path: 'createdBy',
      select: 'name email'
    }
  });

  const result = await queryBuilder.search(ResourceSearchableFields).paginate().execute();

  return {
    meta: result.meta,
    result: result.data
  };
};

const getResourceById = async (id: string): Promise<IResource> => {
  const resource = await Resource.findOne({ _id: id });
  if (!resource) {
    throw new AppError('This Resource is not found', httpStatus.NOT_FOUND);
  }
  return resource;
};

const createResource = async (req: Request): Promise<IResource> => {
  const userId = req.user?.id;
  const result = await Resource.create({
    ...req.body,
    createdBy: userId
  });
  return result;
};

const updateResource = async (id: string, req: Request): Promise<IResource | null> => {
  const resource = await Resource.findOne({ _id: id });
  if (!resource) {
    throw new AppError('This Resource does not exist', httpStatus.NOT_FOUND);
  }

  const { ...remainingData } = req.body;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData
  };

  const result = await Resource.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true
  });

  return result;
};

const deleteResource = async (id: string): Promise<null> => {
  const resource = await Resource.findOne({ _id: id });
  if (!resource) {
    throw new AppError('This Resource is not found', httpStatus.NOT_FOUND);
  }

  await Resource.findByIdAndDelete(id);

  return null;
};

export const ResourceService = {
  getAllResource,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
};
