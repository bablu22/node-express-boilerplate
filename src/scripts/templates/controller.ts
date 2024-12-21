export const controllerTemplate = `
import { RequestHandler} from 'express';
import { {{ModuleName}}Service } from './{{moduleName}}.service';
import asyncHandler from '@/middlewares/asyncHandler';
import sendResponse from '@/common/utils/sendResponse';

const getAll{{ModuleName}}: RequestHandler = asyncHandler(async (req, res) => {
  const result = await {{ModuleName}}Service.getAll{{ModuleName}}(req.query); 

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: '{{ModuleName}} retrieved successfully',
    data: result.result,
    meta: result.meta
  });
});

const get{{ModuleName}}ById: RequestHandler = asyncHandler(async (req, res) => {
  const result = await {{ModuleName}}Service.get{{ModuleName}}ById(req.params.id); 

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: '{{ModuleName}} retrieved successfully',
    data: result
  });
});

const create{{ModuleName}}: RequestHandler = asyncHandler(async (req, res) => {
  const result = await {{ModuleName}}Service.create{{ModuleName}}(req); 

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: '{{ModuleName}} created successfully',
    data: result
  });
});

const update{{ModuleName}}: RequestHandler = asyncHandler(async (req, res) => {
  const result = await {{ModuleName}}Service.update{{ModuleName}}(req.params.id, req); 

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: '{{ModuleName}} updated successfully',
    data: result
  });
});

const delete{{ModuleName}}: RequestHandler = asyncHandler(async (req, res) => {
  await {{ModuleName}}Service.delete{{ModuleName}}(req.params.id); 

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: '{{ModuleName}} deleted successfully',
    data: null
  });
});

export const {{ModuleName}}Controller = {
  getAll{{ModuleName}},
  get{{ModuleName}}ById,
  create{{ModuleName}},
  update{{ModuleName}},
  delete{{ModuleName}}
};
`;
