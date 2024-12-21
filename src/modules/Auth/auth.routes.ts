import { Router } from 'express';

import { authenticateJWT } from '@/common/passport/strategy';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import validate from '@/middlewares/validate';

const router = Router();
/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     description: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 */

router.post('/register', validate(authValidation.register), authController.register);

router.post('/login', validate(authValidation.login), authController.login);

router.post('/verify/email', validate(authValidation.verifyEmail), authController.verifyEmail);

router.post('/logout', authenticateJWT, authController.logout);

router.post(
  '/forgot-password',
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  validate(authValidation.resetPassword),
  authController.resetPassword
);

router.get('/refresh', authController.refreshToken);
router.get('/check', authController.checkAuth);

export default router;
