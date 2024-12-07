import { Schema, Types, model } from 'mongoose';
import { IResource, IResourceModel, ResourceType } from './resource.interface';
import { MongoError } from '@/common/utils/error';

const ResourceSchema = new Schema<IResource, IResourceModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    alias: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: Object.values(ResourceType),
      required: true
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

ResourceSchema.index({ name: 'text' });

ResourceSchema.index({ type: 1 });

// index for createdAt and updatedAt
ResourceSchema.index({ createdAt: 1 });
ResourceSchema.index({ updatedAt: 1 });

ResourceSchema.post<IResource>(
  'save',
  (error: any, doc: IResource, next: (err?: Error) => void) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // Check for duplicate key error
      if (error.message.includes('duplicate key error')) {
        const errorMessage = `Resource with name ${doc.name} already exists`;
        next(new MongoError(errorMessage));
      } else {
        next(new MongoError(error.message));
      }
    } else {
      next();
    }
  }
);

export const ResourceModelName = 'Resource';
const Resource = model<IResource, IResourceModel>('Resource', ResourceSchema);
export default Resource;
