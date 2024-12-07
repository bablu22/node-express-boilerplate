import * as z from 'zod';
import { IResource, ResourceType } from './resource.interface';

type Properties<Input> = {
  [K in keyof Input]: any;
};

export const createResourceSchema = z.object({
  body: z.object<Partial<Properties<IResource>>>({
    name: z
      .string({
        errorMap: () => ({
          message: 'Name must be a string and have at least 2 characters and at most 50 characters'
        })
      })
      .min(2)
      .max(50),
    alias: z.string({
      message: 'Please provide a resource alias'
    }),
    type: z.enum(Object.values(ResourceType) as [string, ...string[]], {
      message: `Resource type must be one of ${Object.values(ResourceType).join(', ')}`
    })
  })
});

export const updateResourceSchema = z.object({
  body: z.object<Partial<Properties<IResource>>>({
    name: z.string().min(3).max(50).optional()
  })
});
