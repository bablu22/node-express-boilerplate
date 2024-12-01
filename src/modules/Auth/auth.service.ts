import { Request } from 'express';
import User, { VerificationCode } from '../User/user.model';
import { BadRequestException } from '@/common/utils/error';
import ErrorCode from '@/common/enums/error-code.enums';
import config from '@/config/app.config';
import { VerificationEnum } from '@/common/enums/verification-code.enums';
import { fortyFiveMinutesFromNow } from '@/common/utils/date-time';

const register = async (req: Request) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.exists({ email });
  if (existingUser) {
    throw new BadRequestException(
      'This email is already in use',
      ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
    );
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const verification = await VerificationCode.create({
    userId: newUser._id,
    type: VerificationEnum.EMAIL_VERIFICATION,
    expiresAt: fortyFiveMinutesFromNow(),
  });

  const verificationUrl = `${config.APP_ORIGIN}/confirm-account?code=${verification.code}`;
};
