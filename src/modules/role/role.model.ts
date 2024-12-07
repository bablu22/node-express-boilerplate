import mongoose, { Schema, Types, model } from 'mongoose';
import { IRole, IRoleModel } from './role.interface';
import { MongoError } from '@/common/utils/error';

const RoleSchema = new Schema<IRole, IRoleModel>(
  {
    name: { type: String, unique: true, required: true },
    isSuperAdmin: { type: Boolean },
    isAdmin: { type: Boolean },
    alias: { type: String, unique: true, required: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      default: new Types.ObjectId('000000000000000000000000')
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      default: new Types.ObjectId('000000000000000000000000')
    }
  },
  { timestamps: true }
);

// text index for name
RoleSchema.index({ name: 'text' });

// index for createdAt and updatedAt
RoleSchema.index({ createdAt: 1 });
RoleSchema.index({ updatedAt: 1 });

// index for isSuperAdmin and isAdmin
RoleSchema.index({ isSuperAdmin: 1 });
RoleSchema.index({ isAdmin: 1 });

RoleSchema.post<IRole>('save', (error: any, doc: IRole, next: (err?: Error) => void) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // Check for duplicate key error
    if (error.message.includes('duplicate key error')) {
      const errorMessage = `Role with name ${doc.name} already exists`;
      next(new MongoError(errorMessage));
    } else {
      next(new MongoError(error.message));
    }
  } else {
    next();
  }
});

export const RoleModelName = 'Role';

const Role = model<IRole, IRoleModel>('Role', RoleSchema);
export default Role;
