import { Router } from 'express';
import validate from '@/middlewares/validate';
import { authenticateJWT } from '@/common/passport/strategy';
import { sessionController } from './session.controller';
import { sessionValidation } from './session.validation';

const router = Router();

router.use(authenticateJWT);

router.get('/all', sessionController.getAllSession);
router.get('/', sessionController.getSession);
router.delete('/:id', validate(sessionValidation.deleteSession), sessionController.deleteSession);

export default router;
