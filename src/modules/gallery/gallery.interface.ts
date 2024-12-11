import { Document, Model, Types } from 'mongoose';

export interface IGallery extends Document {
  _id: Types.ObjectId;
  public_id: string;
  url: string;
  folder: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IFolder extends Document {
  _id: Types.ObjectId;
  name: string;
  images: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IGalleryModel extends Model<IGallery> {
  isImageExists(public_id: string): Promise<boolean>;
}

export interface IFolderModel extends Model<IFolder> {
  createFolder(name: string): Promise<IFolder>;
  deleteFolder(name: string): Promise<void>;
}
