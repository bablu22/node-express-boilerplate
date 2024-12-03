import { Request } from 'express';
import User, { VerificationCode } from '../User/user.model';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@/common/utils/error';
import ErrorCode from '@/common/enums/error-code.enums';
import config from '@/config/app.config';
import { VerificationEnum } from '@/common/enums/verification-code.enums';
import {
  anHourFromNow,
  calculateExpirationDate,
  fortyFiveMinutesFromNow,
  ONE_DAY_IN_MS,
  threeMinutesAgo,
} from '@/common/utils/date-time';
import { renderEjs } from '@/common/utils/renderEjs';
import { emailQueue, emailQueueName } from '@/jobs/Email';
import { logger } from '@/common/utils/logger';
import { refreshTokenSignOptions, signJwtToken, verifyJwtToken } from '@/common/utils/jwt';
import Session from '../Session/session.model';
import { HTTPSTATUS } from '@/config/http.config';
import { hashValue } from '@/common/utils/bcrypt';

const register = async (req: Request) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if a user exists with the same email (unverified)
  const unverifiedUser = await User.findOne({ email, isEmailVerified: false });
  if (unverifiedUser) {
    await VerificationCode.deleteMany({ userId: unverifiedUser._id });
    await User.deleteOne({ _id: unverifiedUser._id });
  }

  // Check if a verified user exists with the same email
  const verifiedUser = await User.exists({ email, isEmailVerified: true });
  if (verifiedUser) {
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

  const verificationLink = `${config.APP_ORIGIN}/confirm-account?code=${verification.code}`;

  const html = await renderEjs('verify-email', { verificationLink });

  await emailQueue.add(emailQueueName, {
    to: email,
    subject: 'Please verify your email',
    body: html,
  });

  return newUser;
};

const verifyEmail = async (code: string) => {
  const validCode = await VerificationCode.findOne({
    code: code,
    type: VerificationEnum.EMAIL_VERIFICATION,
    expiresAt: { $gt: new Date() },
  });

  if (!validCode) {
    throw new BadRequestException('Invalid or expired verification code');
  }

  const updatedUser = await User.findByIdAndUpdate(
    validCode.userId,
    {
      isEmailVerified: true,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new BadRequestException('Unable to verify email address', ErrorCode.VALIDATION_ERROR);
  }

  await validCode.deleteOne();

  return updatedUser;
};

const login = async (req: Request) => {
  const userAgent = req.headers['user-agent'];
  const { email, password } = req.body;

  logger.info(`Login attempt for email: ${email}`);
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    logger.warn(`Login failed: User with email ${email} not found`);
    throw new BadRequestException(
      'Invalid email or password provided',
      ErrorCode.AUTH_USER_NOT_FOUND
    );
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    logger.warn(`Login failed: Invalid password for email: ${email}`);
    throw new BadRequestException(
      'Invalid email or password provided',
      ErrorCode.AUTH_USER_NOT_FOUND
    );
  }

  // Check if the user enable 2fa return user= null
  if (user.userPreferences.enable2FA) {
    logger.info(`2FA required for user ID: ${user._id}`);
    return {
      user: null,
      mfaRequired: true,
      accessToken: '',
      refreshToken: '',
    };
  }

  logger.info(`Creating session for user ID: ${user._id}`);
  const session = await Session.create({
    userId: user._id,
    userAgent,
  });

  logger.info(`Signing tokens for user ID: ${user._id}`);
  const accessToken = signJwtToken({
    userId: user._id,
    sessionId: session._id,
  });

  const refreshToken = signJwtToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );

  logger.info(`Login successful for user ID: ${user._id}`);
  return {
    user,
    accessToken,
    refreshToken,
    mfaRequired: false,
  };
};

const logout = async (req: Request) => {
  const sessionId = req.sessionId;

  if (!sessionId) {
    throw new NotFoundException('The session was not found');
  }

  await Session.findByIdAndDelete(sessionId);

  return null;
};

const refreshToken = async (refreshToken: string) => {
  const { payload } = verifyJwtToken(refreshToken, { secret: refreshTokenSignOptions.secret });

  if (!payload) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const session = await Session.findById(payload.sessionId);

  const now = Date.now();

  if (!session) {
    throw new UnauthorizedException('Invalid refresh token');
  }
  if (session.expiredAt.getTime() <= now) {
    throw new UnauthorizedException('Session expired');
  }

  const sessionRequireRefresh = session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

  if (sessionRequireRefresh) {
    session.expiredAt = calculateExpirationDate(config.JWT.REFRESH_EXPIRES_IN);
    await session.save();
  }

  const newRefreshToken = sessionRequireRefresh
    ? signJwtToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signJwtToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  //check mail rate limit is 2 emails per 3 or 10 min
  const timeAgo = threeMinutesAgo();
  const maxAttempts = 2;

  const count = await VerificationCode.countDocuments({
    userId: user._id,
    type: VerificationEnum.PASSWORD_RESET,
    createdAt: { $gt: timeAgo },
  });

  if (count >= maxAttempts) {
    throw new HttpException(
      'Too many request, try again later',
      HTTPSTATUS.TOO_MANY_REQUESTS,
      ErrorCode.AUTH_TOO_MANY_ATTEMPTS
    );
  }

  const expiresAt = anHourFromNow();
  const validCode = await VerificationCode.create({
    userId: user._id,
    type: VerificationEnum.PASSWORD_RESET,
    expiresAt,
  });

  const resetLink = `${config.APP_ORIGIN}/reset-password?code=${
    validCode.code
  }&exp=${expiresAt.getTime()}`;

  const html = await renderEjs('reset-password', { resetLink });

  await emailQueue.add(emailQueueName, {
    to: user.email,
    subject: 'Please reset your password',
    body: html,
  });

  return null;
};

const resetPassword = async (req: Request) => {
  const { verificationCode, password } = req.body;

  const validCode = await VerificationCode.findOne({
    code: verificationCode,
    type: VerificationEnum.PASSWORD_RESET,
    expiresAt: { $gt: new Date() },
  });

  if (!validCode) {
    throw new NotFoundException('Invalid or expired verification code');
  }

  const hashedPassword = await hashValue(password);

  const updatedUser = await User.findByIdAndUpdate(validCode.userId, {
    password: hashedPassword,
  });

  if (!updatedUser) {
    throw new BadRequestException('Failed to reset password!');
  }

  await validCode.deleteOne();

  await Session.deleteMany({
    userId: updatedUser._id,
  });

  return null;
};

export const authService = {
  register,
  verifyEmail,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
