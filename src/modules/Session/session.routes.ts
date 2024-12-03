import { Router } from 'express';
import { sessionController } from './session.controller';
import validate from '@/middlewares/validate';
import { sessionValidation } from './session.validation';
import { authenticateJWT } from '@/common/passport/strategy';

const sessionRoutes = Router();

sessionRoutes.use(authenticateJWT);

sessionRoutes.get('/all', sessionController.getAllSession);
sessionRoutes.get('/', sessionController.getSession);
sessionRoutes.delete(
  '/:id',
  validate(sessionValidation.deleteSession),
  sessionController.deleteSession
);

export default sessionRoutes;
