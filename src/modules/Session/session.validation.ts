import * as z from 'zod';

const deleteSession = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Please enter the session id'
    })
  })
});

export const sessionValidation = {
  deleteSession
};
