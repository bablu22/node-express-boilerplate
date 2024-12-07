import { RequestHandler } from 'express';
import { RoleService } from './role.service';
import asyncHandler from '@/middlewares/asyncHandler';
import sendResponse from '@/common/utils/sendResponse';

const getAllRole: RequestHandler = asyncHandler(async (req, res) => {
  const result = await RoleService.getAllRole(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Role retrieved successfully',
    data: result.result,
    meta: result.meta
  });
});

const getRoleById: RequestHandler = asyncHandler(async (req, res) => {
  const result = await RoleService.getRoleById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Role retrieved successfully',
    data: result
  });
});

const createRole: RequestHandler = asyncHandler(async (req, res) => {
  const result = await RoleService.createRole(req);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Role created successfully',
    data: result
  });
});

const updateRole: RequestHandler = asyncHandler(async (req, res) => {
  const result = await RoleService.updateRole(req.params.id, req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Role updated successfully',
    data: result
  });
});

const deleteRole: RequestHandler = asyncHandler(async (req, res) => {
  await RoleService.deleteRole(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Role deleted successfully',
    data: null
  });
});

export const RoleController = {
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
