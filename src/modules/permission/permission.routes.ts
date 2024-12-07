import { Router } from 'express';
import { PermissionController } from './permission.controller';
import validate from '@/middlewares/validate';
import { createPermissionSchema, updatePermissionSchema } from './permission.validation';
import { authenticateJWT } from '@/common/passport/strategy';

const router = Router();

router.get('/all', PermissionController.getAllPermission);

router.get('/:id', PermissionController.getPermissionById);

router.post(
  '/create',
  authenticateJWT,
  validate(createPermissionSchema),
  PermissionController.createPermission
);

router.patch(
  '/update/:id',
  authenticateJWT,
  validate(updatePermissionSchema),
  PermissionController.updatePermission
);

router.delete('/delete/:id', PermissionController.deletePermission);

export default router;
