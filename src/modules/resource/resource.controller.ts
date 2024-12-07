import { RequestHandler } from 'express';
import { ResourceService } from './resource.service';
import asyncHandler from '@/middlewares/asyncHandler';
import sendResponse from '@/common/utils/sendResponse';

const getAllResource: RequestHandler = asyncHandler(async (req, res) => {
  const result = await ResourceService.getAllResource(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Resource retrieved successfully',
    data: result.result,
    meta: result.meta
  });
});

const getResourceById: RequestHandler = asyncHandler(async (req, res) => {
  const result = await ResourceService.getResourceById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Resource retrieved successfully',
    data: result
  });
});

const createResource: RequestHandler = asyncHandler(async (req, res) => {
  const result = await ResourceService.createResource(req);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Resource created successfully',
    data: result
  });
});

const updateResource: RequestHandler = asyncHandler(async (req, res) => {
  const result = await ResourceService.updateResource(req.params.id, req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Resource updated successfully',
    data: result
  });
});

const deleteResource: RequestHandler = asyncHandler(async (req, res) => {
  await ResourceService.deleteResource(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Resource deleted successfully',
    data: null
  });
});

export const ResourceController = {
  getAllResource,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
};
