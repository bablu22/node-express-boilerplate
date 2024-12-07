import { RequestHandler } from 'express';
import { PermissionService } from './permission.service';
import asyncHandler from '@/middlewares/asyncHandler';
import sendResponse from '@/common/utils/sendResponse';

const getAllPermission: RequestHandler = asyncHandler(async (req, res) => {
  const result = await PermissionService.getAllPermission(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Permission retrieved successfully',
    data: result.result,
    meta: result.meta
  });
});

const getPermissionById: RequestHandler = asyncHandler(async (req, res) => {
  const result = await PermissionService.getPermissionById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Permission retrieved successfully',
    data: result
  });
});

const createPermission: RequestHandler = asyncHandler(async (req, res) => {
  const result = await PermissionService.createPermission(req);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Permission created successfully',
    data: result
  });
});

const updatePermission: RequestHandler = asyncHandler(async (req, res) => {
  const result = await PermissionService.updatePermission(req.params.id, req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Permission updated successfully',
    data: result
  });
});

const deletePermission: RequestHandler = asyncHandler(async (req, res) => {
  await PermissionService.deletePermission(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Permission deleted successfully',
    data: null
  });
});

export const PermissionController = {
  getAllPermission,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
};
