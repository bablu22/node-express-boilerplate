// src/common/utils/AppError.ts
import { HTTPSTATUS, HttpStatusCode } from '@/config/http.config';
import ErrorCode from '@/common/enums/error-code.enums';

export class AppError extends Error {
  public statusCode: HttpStatusCode;
  public errorCode?: ErrorCode;
  public details?: any;

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCode,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
