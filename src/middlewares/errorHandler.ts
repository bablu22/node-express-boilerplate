import { z } from 'zod';
import { ErrorRequestHandler, Response } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import { AppError } from '../common/utils/AppError';
import { clearAuthenticationCookies, REFRESH_PATH } from '@/common/utils/cookie';
import config from '@/config/app.config';

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: 'Validation failed',
    errors: errors,
  });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next): any => {
  if (config.NODE_ENV === 'development') {
    console.error(`Error occurred on PATH: ${req.path}`, error);
  }

  if (req.path === REFRESH_PATH) {
    clearAuthenticationCookies(res);
  }

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: 'Invalid JSON format, please check your request body',
    });
  }

  if (error instanceof z.ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof TypeError) {
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Unknown error occurred',
      error: error?.message || 'Unknown error occurred',
    });
  }

  if (error instanceof ReferenceError) {
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Unknown error occurred',
      error: error?.message || 'Unknown error occurred',
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: error.message || 'Unknown error occurred',
      error: error?.message || 'Unknown error occurred',
    });
  }

  if (error.name === 'CastError') {
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Invalid ID format, please check your request body or params',
      error: error?.message || 'Unknown error occurred',
    });
  }

  if (error instanceof RangeError) {
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Unknown error occurred',
      error: error?.message || 'Unknown error occurred',
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  if (error instanceof Error) {
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Unknown error occurred',
    });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    error: error?.message || 'Unknown error occurred',
  });
};
