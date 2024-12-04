import { authenticateJWT } from '@/common/passport/strategy';
import { Router } from 'express';
import validate from '@/middlewares/validate';
import { mfaController } from './mfa.controller';
import { mfaValidation } from './mfa.validation';

const router = Router();

router.get('/setup', authenticateJWT, mfaController.generateMFASetup);

router.post(
  '/verify',
  validate(mfaValidation.verifyMFA),
  authenticateJWT,
  mfaController.verifyMFASetup
);
router.put('/revoke', authenticateJWT, mfaController.revokeMFASetup);

router.post(
  '/verify-login',
  validate(mfaValidation.verifyMFAForLogin),
  mfaController.verifyMFAForLogin
);

export default router;
