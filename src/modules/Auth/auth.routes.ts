import { Router } from 'express';
import { authController } from './auth.controller';
import validate from '@/middlewares/validate';
import { authValidation } from './auth.validation';
import { authenticateJWT } from '@/common/passport/strategy';

const authRoutes = Router();

authRoutes.post('/register', validate(authValidation.register), authController.register);
authRoutes.post('/login', validate(authValidation.login), authController.login);
authRoutes.post('/verify/email', validate(authValidation.verifyEmail), authController.verifyEmail);
authRoutes.post('/logout', authenticateJWT, authController.logout);
authRoutes.post(
  '/forgot-password',
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
authRoutes.post(
  '/reset-password',
  validate(authValidation.resetPassword),
  authController.resetPassword
);

authRoutes.get('/refresh', authController.refreshToken);

export default authRoutes;
