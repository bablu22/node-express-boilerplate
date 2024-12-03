import { authenticateJWT } from '@/common/passport/strategy';
import { Router } from 'express';
import { mfaController } from './mfa.controller';
import validate from '@/middlewares/validate';
import { mfaValidation } from './mfa.validation';

const mfaRoutes = Router();

mfaRoutes.get('/setup', authenticateJWT, mfaController.generateMFASetup);

mfaRoutes.post(
  '/verify',
  validate(mfaValidation.verifyMFA),
  authenticateJWT,
  mfaController.verifyMFASetup
);
mfaRoutes.put('/revoke', authenticateJWT, mfaController.revokeMFASetup);

mfaRoutes.post(
  '/verify-login',
  validate(mfaValidation.verifyMFAForLogin),
  mfaController.verifyMFAForLogin
);

export default mfaRoutes;
