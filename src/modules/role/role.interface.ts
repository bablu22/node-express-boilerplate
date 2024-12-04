import { ObjectId } from 'mongoose';

export interface IRole {
  name: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  alias: string;
  permissions: ObjectId[];
  createdBy: ObjectId;
  updatedBy: ObjectId;
}
