import { Document, Model, ObjectId, Types } from 'mongoose';

export interface IRole extends Document {
  _id: Types.ObjectId;
  name: string;
  alias: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  permissions: ObjectId[];
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

export interface IRoleModel extends Model<IRole> {
  isExist(id: string): Promise<boolean>;
}
