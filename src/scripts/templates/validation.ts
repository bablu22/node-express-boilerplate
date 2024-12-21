export const validationTemplate = `
import * as z from 'zod';
import { I{{ModuleName}} } from './{{moduleName}}.interface';

type Properties<Input> = {
  [K in keyof Input]: any;
};

export const create{{ModuleName}}Schema = z.object({
  body: z.object<Partial<Properties<I{{ModuleName}}>>>({
    name: z.string().min(3).max(50),
  }),
});

export const update{{ModuleName}}Schema = z.object({
  body: z.object<Partial<Properties<I{{ModuleName}}>>>({
    name: z.string().min(3).max(50).optional(), 
  }),
});
`;
