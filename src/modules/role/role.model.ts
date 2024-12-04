import { IRole } from './role.interface';
import mongoose from 'mongoose';
import { MongoError } from '@/common/utils/error';

const schema = new mongoose.Schema<IRole>(
  {
    name: { type: String, unique: true, required: true },
    isSuperAdmin: { type: Boolean },
    isAdmin: { type: Boolean },
    alias: { type: String, unique: true, required: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: '000000000000',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: '000000000000',
    },
  },
  { timestamps: true }
);

// text index for name
schema.index({ name: 'text' });

// index for createdAt and updatedAt
schema.index({ createdAt: 1 });
schema.index({ updatedAt: 1 });

// index for isSuperAdmin and isAdmin
schema.index({ isSuperAdmin: 1 });
schema.index({ isAdmin: 1 });

schema.post<IRole>('save', (error: any, doc: IRole, next: (err?: Error) => void) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    // Check for duplicate key error
    if (error.message.includes('duplicate key error')) {
      const errorMessage = `Name already exists`;
      next(new MongoError(errorMessage));
    } else {
      next(new MongoError(error.message));
    }
  } else {
    next();
  }
});

const Role = mongoose.model<IRole>('Role', schema);

export default Role;
