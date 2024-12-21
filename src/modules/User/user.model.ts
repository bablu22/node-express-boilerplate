import { Schema } from 'mongoose';
import { compareValue, hashValue } from '@common/utils/bcrypt';
import mongoose from 'mongoose';
import { generateUniqueCode } from '@/common/utils/uuid';
import { IUser, IVerificationCode, UserPreferences } from './user.interface';
import { MongoError } from '@/common/utils/error';
import mongooseToSwagger from 'mongoose-to-swagger';

const userPreferencesSchema = new Schema<UserPreferences>({
  enable2FA: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: true },
  twoFactorSecret: { type: String, required: false }
});

const verificationCodeSchema = new Schema<IVerificationCode>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  code: {
    type: String,
    unique: true,
    required: true,
    default: generateUniqueCode
  },
  type: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    phone: {
      type: String,
      unique: true,
      required: false,
      index: true
    },
    address: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    roleAlias: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      default: new mongoose.Types.ObjectId('000000000000000000000000')
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      default: new mongoose.Types.ObjectId('000000000000000000000000')
    },
    password: {
      type: String,
      required: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    userPreferences: {
      type: userPreferencesSchema,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: {}
  }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.index({ username: 'text' });
userSchema.index({ email: 'text' });

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.userPreferences.twoFactorSecret;
    return ret;
  }
});

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashValue(this.password);
  }
  next();
});

userSchema.post<IUser>('save', (error: any, doc: IUser, next: (err?: Error) => void) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // Check for duplicate key error
    if (error.message.includes('duplicate key error')) {
      const errorMessage = `User with ${error.message.match(/"(.+?)"/g).join(', ')} already exists`;
      next(new MongoError(errorMessage));
    } else {
      next(new MongoError(error.message));
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

const User = mongoose.model<IUser>('User', userSchema, 'users');

export const VerificationCode = mongoose.model<IVerificationCode>(
  'VerificationCode',
  verificationCodeSchema,
  'verification-codes'
);

export default User;

export const userSwaggerSchema = mongooseToSwagger(User);
