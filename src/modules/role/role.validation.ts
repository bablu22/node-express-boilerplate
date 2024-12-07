import * as z from 'zod';
import { IRole } from './role.interface';

type Properties<Input> = {
  [K in keyof Input]: any;
};

export const createRoleSchema = z.object({
  body: z.object<Partial<Properties<IRole>>>({
    name: z.string().min(3).max(50),
    alias: z.string().min(3).max(50)
  })
});

export const updateRoleSchema = z.object({
  // Define updateRole schema properties here
});
