import { VerificationEnum } from '@/common/enums/verification-code.enums';
import mongoose, { Document, Model } from 'mongoose';

export interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  userPreferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVerificationCode extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: VerificationEnum;
  expiresAt: Date;
  createdAt: Date;
}

export interface IUserModel extends Model<IUser> {
  comparePassword(value: string): Promise<boolean>;
}
