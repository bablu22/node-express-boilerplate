import asyncHandler from '@/middlewares/asyncHandler';
import { RequestHandler } from 'express';
import { HTTPSTATUS } from '@/config/http.config';
import sendResponse from '@/common/utils/sendResponse';
import {
  clearAuthenticationCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
} from '@/common/utils/cookie';
import { UnauthorizedException } from '@/common/utils/error';
import { authService } from './auth.service';

const register: RequestHandler = asyncHandler(async (req, res) => {
  const result = await authService.register(req);

  sendResponse(res, {
    success: true,
    statusCode: HTTPSTATUS.OK,
    message: 'User registered successfully! Please check your email for verification.',
    data: result,
  });
});

const verifyEmail: RequestHandler = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const result = await authService.verifyEmail(code);

  sendResponse(res, {
    success: true,
    statusCode: HTTPSTATUS.OK,
    message: 'Email verified successfully',
    data: result,
  });
});

const login: RequestHandler = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken, mfaRequired } = await authService.login(req);

  if (mfaRequired) {
    return sendResponse(res, {
      success: true,
      statusCode: HTTPSTATUS.OK,
      message: 'User logged in successfully',
      data: {
        user,
        mfaRequired,
      },
    });
  }

  setAuthenticationCookies({ res, accessToken, refreshToken });

  sendResponse(res, {
    success: true,
    statusCode: HTTPSTATUS.OK,
    message: 'User logged in successfully',
    data: {
      user,
      accessToken,
      refreshToken,
      mfaRequired,
    },
  });
});

const logout: RequestHandler = asyncHandler(async (req, res) => {
  await authService.logout(req);

  clearAuthenticationCookies(res);

  sendResponse(res, {
    success: true,
    statusCode: HTTPSTATUS.OK,
    message: 'User logged out successfully',
    data: null,
  });
});

const refreshToken: RequestHandler = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new UnauthorizedException('Missing refresh token');
  }

  const { accessToken, refreshToken } = await authService.refreshToken(token);

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
  }

  res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());

  sendResponse(res, {
    success: true,
    statusCode: HTTPSTATUS.OK,
    message: 'Token refreshed successfully',
    data: null,
  });
});

const forgotPassword: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  sendResponse(res, {
    success: true,
    statusCode: HTTPSTATUS.OK,
    message: 'Email sent successfully',
    data: result,
  });
});

const resetPassword: RequestHandler = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req);

  sendResponse(res, {
    success: true,
    statusCode: HTTPSTATUS.OK,
    message: 'Password reset successfully',
    data: result,
  });
});

export const authController = {
  register,
  verifyEmail,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
