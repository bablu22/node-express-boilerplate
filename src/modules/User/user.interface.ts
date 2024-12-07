import { VerificationEnum } from '@/common/enums/verification-code.enums';
import mongoose, { Document } from 'mongoose';

export interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  address: string;
  isActive: boolean;
  roleId: mongoose.Types.ObjectId;
  roleAlias: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  userPreferences: UserPreferences;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(value: string): Promise<boolean>;
}

export interface IVerificationCode extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: VerificationEnum;
  expiresAt: Date;
  createdAt: Date;
}
