import { Schema } from 'mongoose';
import { IUser, IVerificationCode, UserPreferences } from './user.interface';
import { compareValue, hashValue } from '@common/utils/bcrypt';
import mongoose from 'mongoose';
import { generateUniqueCode } from '@/common/utils/uuid';

const userPreferencesSchema = new Schema<UserPreferences>({
  enable2FA: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: true },
  twoFactorSecret: { type: String, required: false },
});

const verificationCodeSchema = new Schema<IVerificationCode>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
    default: generateUniqueCode,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    userPreferences: {
      type: userPreferencesSchema,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {},
  }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashValue(this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.userPreferences.twoFactorSecret;
    return ret;
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export const VerificationCode = mongoose.model<IVerificationCode>(
  'VerificationCode',
  verificationCodeSchema,
  'verification-codes'
);

export default User;
