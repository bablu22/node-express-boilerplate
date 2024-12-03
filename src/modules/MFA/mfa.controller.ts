import sendResponse from '@/common/utils/sendResponse';
import asyncHandler from '@/middlewares/asyncHandler';
import { RequestHandler } from 'express';
import { mfaService } from './mfa.service';

const generateMFASetup: RequestHandler = asyncHandler(async (req, res) => {
  const result = await mfaService.generateMFASetup(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Scan the QR code or use the setup key.',
    data: result,
  });
});

const verifyMFASetup: RequestHandler = asyncHandler(async (req, res) => {
  const result = await mfaService.verifyMFASetup(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'MFA setup successfully.',
    data: result,
  });
});

const revokeMFASetup: RequestHandler = asyncHandler(async (req, res) => {
  const result = await mfaService.revokeMFASetup(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'MFA revoked successfully.',
    data: result,
  });
});

const verifyMFAForLogin: RequestHandler = asyncHandler(async (req, res) => {
  const result = await mfaService.verifyMFAForLogin(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'MFA verified successfully.',
    data: result,
  });
});

export const mfaController = {
  generateMFASetup,
  verifyMFASetup,
  revokeMFASetup,
  verifyMFAForLogin,
};
