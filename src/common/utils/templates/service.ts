export const serviceTemplate = `
import { Request } from 'express';
import {{ModuleName}} from './{{moduleName}}.model';
import httpStatus from 'http-status';
import { AppError } from '@/common/utils/AppError';
import { I{{ModuleName}} } from './{{moduleName}}.interface';
import { TMeta } from '@/common/utils/sendResponse';
import QueryBuilder, { QueryOptions } from '@/database/Query';


const getAll{{ModuleName}} = async (
  query: Record<string, unknown>
): Promise<{ meta: TMeta; result: I{{ModuleName}}[] }> => {

  const {{ModuleName}}SearchableFields: (keyof I{{ModuleName}})[]  = ['name'];

  const queryBuilder = new QueryBuilder<I{{ModuleName}}>(
    {{ModuleName}},
    query as QueryOptions
  );

  // Execute query pipeline
  const { data, pagination } = await queryBuilder
    .search({{ModuleName}}SearchableFields) // Apply search
    .filter()                               // Apply filtering
    .sort()                                 // Apply sorting
    .paginate()                             // Apply pagination
    .fields()                               // Apply field selection
    .execute({{ModuleName}}SearchableFields); // Execute query

  return {
    meta: pagination,
    result: data,
  };
};

const get{{ModuleName}}ById = async (id: string): Promise<I{{ModuleName}}> => {
  const {{moduleName}} = await {{ModuleName}}.findOne({ _id: id });
  if (!{{moduleName}}) {
    throw new AppError('This {{ModuleName}} is not found', httpStatus.NOT_FOUND);
  }
  return {{moduleName}};
};

const create{{ModuleName}} = async (req: Request): Promise<I{{ModuleName}}> => {
  const result = await {{ModuleName}}.create(req.body);
  return result;
};

const update{{ModuleName}} = async (id: string, req: Request): Promise<I{{ModuleName}} | null> => {
  const {{moduleName}} = await {{ModuleName}}.findOne({ _id: id });
  if (!{{moduleName}}) {
    throw new AppError('This {{ModuleName}} does not exist', httpStatus.NOT_FOUND);
  }

  const { ...remainingData } = req.body;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData
  };

  const result = await {{ModuleName}}.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true
  });

  return result;
};

const delete{{ModuleName}} = async (id: string): Promise<null> => {
  const {{moduleName}} = await {{ModuleName}}.findOne({ _id: id });
  if (!{{moduleName}}) {
    throw new AppError('This {{ModuleName}} is not found', httpStatus.NOT_FOUND);
  }

  await {{ModuleName}}.findByIdAndDelete(id);

  return null;
};

export const {{ModuleName}}Service = {
  getAll{{ModuleName}},
  get{{ModuleName}}ById,
  create{{ModuleName}},
  update{{ModuleName}},
  delete{{ModuleName}}
};`;
