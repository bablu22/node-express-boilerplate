import asyncHandler from '@/middlewares/asyncHandler';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { GalleryService } from './gallery.service';
import sendResponse from '@/common/utils/sendResponse';

const getAllImages: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.getAllImages(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Images retrieved successfully',
    data: result.result,
    meta: result.meta
  });
});

const getImagesByFolder: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.getImagesByFolder(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Images retrieved successfully',
    data: result
  });
});

const createImage: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.createImage(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Image uploaded successfully',
    data: result
  });
});

const deleteImage: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.deleteImage(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Image deleted successfully',
    data: result
  });
});

const deleteBatchImages: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.deleteBatchImages(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Images deleted successfully',
    data: result
  });
});

// Function to create a folder
const createFolder: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.createFolder(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Folder created successfully',
    data: result
  });
});

// Function to get all folders
const getFolders: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.getFolders(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Folders retrieved successfully',
    data: result.result,
    meta: result.meta
  });
});

// Function to delete a folder
const deleteFolder: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.deleteFolder(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Folder deleted successfully',
    data: result
  });
});

const createAttachment: RequestHandler = asyncHandler(async (req, res) => {
  const result = await GalleryService.createAttachment(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Attachment uploaded successfully',
    data: result
  });
});

export const GalleryController = {
  getAllImages,
  getImagesByFolder,
  createImage,
  deleteImage,
  createFolder,
  deleteFolder,
  getFolders,
  createAttachment,
  deleteBatchImages
};
