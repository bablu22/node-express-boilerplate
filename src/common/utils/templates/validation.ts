export const validationTemplate = `
import * as z from 'zod';

export const create{{ModuleName}}Schema = z.object({
  // Define create{{ModuleName}} schema properties here
});

export const update{{ModuleName}}Schema = z.object({
  // Define update{{ModuleName}} schema properties here
});
`;
