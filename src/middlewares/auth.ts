import { Request, Response, NextFunction } from 'express';
import { searchOne } from '@/database/repository';
import { Types } from 'mongoose';
import { IUser } from '@/modules/user/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { GeneralError } from '@/common/utils/error';
import { ILogger, logger } from '@/common/utils/logger';

const createCorrelationLogger = (correlationId: string): ILogger => ({
  info: (message, metadata = {}) => logger.info(message, { correlationId, ...metadata }),
  error: (message, metadata = {}) => logger.error(message, { correlationId, ...metadata }),
  debug: (message, metadata = {}) => logger.debug(message, { correlationId, ...metadata })
});

/**
 * Error handling middleware
 * @returns Middleware function to handle errors
 */
export const handleError = (): any => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res?.headersSent) {
      return next(err);
    }

    const code = err instanceof GeneralError ? err.getCode() : 500;
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();

    // Ensure logging even if req.log is not available
    (req.log || logger).error(err.message, {
      correlationId,
      error: err.toString(),
      stack: err.stack
    });

    return res.status(code).send({
      correlationId,
      message: err.message,
      status: 'error',
      error: { ...err }
    });
  };
};

/**
 * Request logging and correlation ID middleware
 * @returns Middleware function to add logging and correlation ID
 */
export const handleRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Generate or use existing correlation ID
  let correlationId = req.headers['x-correlation-id'] as string;
  if (!correlationId) {
    correlationId = uuidv4();
    req.headers['x-correlation-id'] = correlationId;
  }

  // Set correlation ID in response headers
  res.set('x-correlation-id', correlationId);

  // Create a child logger with correlation ID
  req.log = createCorrelationLogger(correlationId);

  // Log request details
  req.log.info('New request', {
    method: req.method,
    url: req.url
  });

  next();
};

/**
 * Authorization middleware to check user permissions
 * @returns Middleware function to authorize requests
 */
export const authorizeRequest = (): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser | undefined;

    // Check if user exists and has required properties
    if (!user || !user.username || !user.roleId) {
      req.log.error('Unauthorized request: No user found', {
        user: user ? JSON.stringify(user) : 'No user object'
      });
      return res.status(401).send({
        error: 'Unauthorized request',
        message: 'No user found in request',
        status: 'error'
      });
    }

    try {
      const { roleId, username } = user;

      // Check user permissions
      const permission = await searchOne(
        {
          roleId: new Types.ObjectId(roleId),
          resourceName: req.originalUrl || '',
          isAllowed: true
        },
        'Permission'
      );

      if (permission) {
        req.log.info('User authorized', {
          username,
          resource: req.originalUrl
        });
        return next();
      }

      // Log unauthorized access attempt
      req.log.error('Unauthorized access attempt', {
        username,
        roleId,
        resource: req.originalUrl
      });

      return res.status(403).send({
        error: 'Forbidden request',
        message: 'You are not allowed to access this resource',
        status: 'error'
      });
    } catch (err: any) {
      // Log and pass any errors to error handling middleware
      req.log.error('Authorization error', {
        errorMessage: err.message,
        stack: err.stack
      });
      return next(err);
    }
  };
};
