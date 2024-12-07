import { Router } from 'express';
import { ResourceController } from './resource.controller';
import validate from '@/middlewares/validate';
import { createResourceSchema, updateResourceSchema } from './resource.validation';
import { authenticateJWT } from '@/common/passport/strategy';

const router = Router();

router.get('/all', ResourceController.getAllResource);

router.get('/:id', ResourceController.getResourceById);

router.post(
  '/create',
  authenticateJWT,
  validate(createResourceSchema),
  ResourceController.createResource
);

router.patch(
  '/update/:id',
  authenticateJWT,
  validate(updateResourceSchema),
  ResourceController.updateResource
);

router.delete('/delete/:id', ResourceController.deleteResource);

export default router;
