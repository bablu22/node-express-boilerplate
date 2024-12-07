import { HTTPSTATUS } from '@/config/http.config';
import { AppError } from './AppError';
import ErrorCode from '@/common/enums/error-code.enums';

export class GeneralError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }

  getCode() {
    return 400;
  }
}

export class HttpException extends AppError {
  constructor(message: string, status: number, errorCode: ErrorCode, details?: any) {
    super(message, status, errorCode, details);
  }
}

export class NotFoundException extends AppError {
  constructor(message = 'Resource not found', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCode.RESOURCE_NOT_FOUND);
  }
}

export class BadRequestException extends AppError {
  constructor(message = 'Bad Request', errorCode?: ErrorCode, details?: any) {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode, details);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = 'Unauthorized Access', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.UNAUTHORIZED, errorCode || ErrorCode.ACCESS_UNAUTHORIZED);
  }
}

export class InternalServerException extends AppError {
  constructor(message = 'Internal Server Error', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode || ErrorCode.INTERNAL_SERVER_ERROR);
  }
}

export class ForbiddenException extends AppError {
  constructor(message = 'Forbidden', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.FORBIDDEN, errorCode || ErrorCode.FORBIDDEN);
  }
}

export class MongoError extends AppError {
  constructor(message = 'MongoError', errorCode?: ErrorCode, details?: any) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
      details
    );
  }
}
