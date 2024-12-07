import * as z from 'zod';

const register = z.object({
  body: z.object({
    firstName: z.string({
      required_error: 'Please enter your first name'
    }),
    lastName: z.string({
      required_error: 'Please enter your last name'
    }),
    email: z
      .string({
        required_error: 'Please enter your email'
      })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string({
        required_error: 'Please enter your password'
      })
      .min(8, { message: 'Password must be at least 8 characters' })
  })
});

const login = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Please enter your email'
      })
      .email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' })
  })
});

const forgotPassword = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Please enter your email'
      })
      .email({ message: 'Please enter a valid email address' })
  })
});

const resetPassword = z.object({
  body: z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    verificationCode: z.string({
      required_error: 'Please enter the verification code'
    })
  })
});

const verifyEmail = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Please enter the verification code'
    })
  })
});

export const authValidation = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail
};
