import { Schema, Types, model } from 'mongoose';
import { IPermission, IPermissionModel } from './permission.interface';
import { MongoError } from '@/common/utils/error';

const PermissionSchema = new Schema<IPermission, IPermissionModel>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    roleName: {
      type: String,
      required: true
    },
    roleAlias: {
      type: String,
      required: true
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: true
    },
    resourceName: {
      type: String,
      required: true
    },
    resourceAlias: {
      type: String,
      required: true
    },
    isAllowed: {
      type: Boolean,
      required: true,
      default: false
    },
    isDisabled: {
      type: Boolean,
      required: true,
      default: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      default: new Types.ObjectId('000000000000000000000000')
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      default: new Types.ObjectId('000000000000000000000000')
    }
  },
  {
    timestamps: true
  }
);

PermissionSchema.post<IPermission>(
  'save',
  (error: any, doc: IPermission, next: (err?: Error) => void) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // Check for duplicate key error
      if (error.message.includes('duplicate key error')) {
        const errorMessage = `Permission with role ${doc.roleName} and resource ${doc.resourceName} already exists`;
        next(new MongoError(errorMessage));
      } else {
        next(new MongoError(error.message));
      }
    } else {
      next();
    }
  }
);

export const PermissionModelName = 'Permission';

const Permission = model<IPermission, IPermissionModel>('Permission', PermissionSchema);
export default Permission;
