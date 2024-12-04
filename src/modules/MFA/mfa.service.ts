import { Request } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@common/utils/error';
import { refreshTokenSignOptions, signJwtToken } from '@/common/utils/jwt';
import Session from '../session/session.model';
import User from '../user/user.model';

const generateMFASetup = async (req: Request) => {
  const user = req.user;

  if (!user) {
    throw new UnauthorizedException('User not authorized');
  }

  if (user.userPreferences.enable2FA) {
    return {
      message: 'MFA already enabled',
    };
  }

  let secretKey = user.userPreferences.twoFactorSecret;
  if (!secretKey) {
    const secret = speakeasy.generateSecret({ name: 'Squeezy' });
    secretKey = secret.base32;
    user.userPreferences.twoFactorSecret = secretKey;
    await user.save();
  }

  const url = speakeasy.otpauthURL({
    secret: secretKey,
    label: `${user.firstName} ${user.lastName}`,
    issuer: 'squeezy.com',
    encoding: 'base32',
  });

  const qrImageUrl = await qrcode.toDataURL(url);

  return {
    qrImageUrl,
    secretKey,
  };
};

const verifyMFASetup = async (req: Request) => {
  const { code, secretKey } = req.body;
  const user = req.user;

  if (!user) {
    throw new UnauthorizedException('User not authorized');
  }

  if (user.userPreferences.enable2FA) {
    return {
      message: 'MFA is already enabled',
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }

  const isValid = speakeasy.totp.verify({
    secret: secretKey,
    encoding: 'base32',
    token: code,
  });

  if (!isValid) {
    throw new BadRequestException('Invalid MFA code. Please try again.');
  }

  user.userPreferences.enable2FA = true;
  await user.save();

  return {
    userPreferences: {
      enable2FA: user.userPreferences.enable2FA,
    },
  };
};

const revokeMFASetup = async (req: Request) => {
  const user = req.user;

  if (!user) {
    throw new UnauthorizedException('User not authorized');
  }

  if (!user.userPreferences.enable2FA) {
    return {
      message: 'MFA is not enabled',
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }

  user.userPreferences.twoFactorSecret = undefined;
  user.userPreferences.enable2FA = false;
  await user.save();

  return {
    userPreferences: {
      enable2FA: user.userPreferences.enable2FA,
    },
  };
};

const verifyMFAForLogin = async (req: Request) => {
  const { email, code } = req.body;
  const userAgent = req.headers['user-agent'];

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (!user.userPreferences.enable2FA && !user.userPreferences.twoFactorSecret) {
    throw new UnauthorizedException('MFA not enabled for this user');
  }

  const isValid = speakeasy.totp.verify({
    secret: user.userPreferences.twoFactorSecret!,
    encoding: 'base32',
    token: code,
  });

  if (!isValid) {
    throw new BadRequestException('Invalid MFA code. Please try again.');
  }

  //sign access token & refresh token
  const session = await Session.create({
    userId: user._id,
    userAgent,
  });

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

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const mfaService = {
  generateMFASetup,
  verifyMFASetup,
  revokeMFASetup,
  verifyMFAForLogin,
};
