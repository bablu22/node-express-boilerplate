export const routesTemplate = `
import { Router } from 'express';
import { {{ModuleName}}Controller } from './{{moduleName}}.controller';
import validate from '@/middlewares/validate';
import { create{{ModuleName}}Schema, update{{ModuleName}}Schema } from './{{moduleName}}.validation';

const router = Router();

router.get('/all', {{ModuleName}}Controller.getAll{{ModuleName}});

router.get('/:id', {{ModuleName}}Controller.get{{ModuleName}}ById);

router.post(
  '/create',
  validate(create{{ModuleName}}Schema),
  {{ModuleName}}Controller.create{{ModuleName}}
);

router.patch(
  '/update/:id',
  validate(update{{ModuleName}}Schema),
  {{ModuleName}}Controller.update{{ModuleName}}
);

router.delete('/delete/:id', {{ModuleName}}Controller.delete{{ModuleName}});

export default router;
`;
