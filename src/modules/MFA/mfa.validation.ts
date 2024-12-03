import * as z from 'zod';

const verifyMFA = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Please enter the verification code',
    }),
    secretKey: z.string({
      required_error: 'Please enter the secret key',
    }),
  }),
});

const verifyMFAForLogin = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Please enter the verification code',
    }),
    email: z.string({
      required_error: 'Please enter the email',
    }),
  }),
});

export const mfaValidation = {
  verifyMFA,
  verifyMFAForLogin,
};
