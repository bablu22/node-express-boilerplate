import { Router } from 'express';
import { RoleController } from './role.controller';
import validate from '@/middlewares/validate';
import { createRoleSchema, updateRoleSchema } from './role.validation';
import { authenticateJWT } from '@/common/passport/strategy';

const router = Router();

router.get('/all', authenticateJWT, RoleController.getAllRole);

router.get('/:id', RoleController.getRoleById);

router.post('/create', authenticateJWT, validate(createRoleSchema), RoleController.createRole);

router.patch('/update/:id', authenticateJWT, validate(updateRoleSchema), RoleController.updateRole);

router.delete('/delete/:id', authenticateJWT, RoleController.deleteRole);

export default router;
