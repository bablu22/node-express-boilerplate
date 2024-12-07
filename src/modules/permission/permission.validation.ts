import * as z from 'zod';
import { IPermission } from './permission.interface';

type Properties<Input> = {
  [K in keyof Input]: any;
};

export const createPermissionSchema = z.object({
  body: z.object<Partial<Properties<IPermission>>>({
    roleId: z.string({
      message: 'Please enter a valid role ID'
    }),
    resourceId: z.string({
      message: 'Please enter a valid resource ID'
    }),
    isAllowed: z.boolean().optional(),
    isDisabled: z.boolean().optional()
  })
});

export const updatePermissionSchema = z.object({
  body: z.object<Partial<Properties<IPermission>>>({})
});
