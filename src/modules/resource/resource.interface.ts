import { Document, Model, Types } from 'mongoose';

export enum ResourceType {
  API = 'api',
  CLIENT = 'client'
}

export interface IResource extends Document {
  _id: Types.ObjectId;
  name: string;
  alias: string;
  type: ResourceType;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export interface IResourceModel extends Model<IResource> {
  isExist(id: string): Promise<boolean>;
}
