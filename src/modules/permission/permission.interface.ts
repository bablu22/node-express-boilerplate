import { Document, Model, Types } from 'mongoose';

export interface IPermission extends Document {
  _id: Types.ObjectId;
  roleId: Types.ObjectId;
  roleName: string;
  roleAlias: string;
  resourceId: Types.ObjectId;
  resourceName: string;
  resourceAlias: string;
  isAllowed: boolean;
  isDisabled: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export interface IPermissionModel extends Model<IPermission> {
  isExist(id: string): Promise<boolean>;
}
