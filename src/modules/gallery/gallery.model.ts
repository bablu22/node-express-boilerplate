import { Schema, model } from 'mongoose';
import { IFolder, IFolderModel, IGallery, IGalleryModel } from './gallery.interface';
import { MongoError } from '@/common/utils/error';

const GallerySchema = new Schema<IGallery, IGalleryModel>(
  {
    public_id: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

GallerySchema.post<IGallery>('save', (error: any, doc: IGallery, next: (err?: Error) => void) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // Check for duplicate key error
    if (error.message.includes('duplicate key error')) {
      const errorMessage = `Image with public ID ${doc.public_id} already exists`;
      next(new MongoError(errorMessage));
    } else {
      next(new MongoError(error.message));
    }
  } else {
    next();
  }
});

GallerySchema.statics.isImageExists = async function (public_id: string) {
  const image = await this.findOne({ public_id });
  return !!image;
};

const FolderSchema = new Schema<IFolder, IFolderModel>(
  {
    name: { type: String, required: true, unique: true },
    images: [{ type: Schema.Types.ObjectId, ref: 'Gallery' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

FolderSchema.post<IFolder>('save', (error: any, doc: IFolder, next: (err?: Error) => void) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // Check for duplicate key error
    if (error.message.includes('duplicate key error')) {
      const errorMessage = `Folder with name ${doc.name} already exists`;
      next(new MongoError(errorMessage));
    } else {
      next(new MongoError(error.message));
    }
  } else {
    next();
  }
});

FolderSchema.statics.createFolder = async function (name: string) {
  return this.create({ name });
};

FolderSchema.statics.deleteFolder = async function (name: string) {
  return this.deleteOne({ name });
};

const Gallery = model<IGallery, IGalleryModel>('Gallery', GallerySchema);
const Folder = model<IFolder, IFolderModel>('Folder', FolderSchema);

export { Gallery, Folder };
