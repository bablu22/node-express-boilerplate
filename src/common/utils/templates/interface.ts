export const interfaceTemplate = `
import { Document, Model, Types } from 'mongoose';

export interface I{{ModuleName}} extends Document {
  _id: Types.ObjectId;
  name: string;
}

export interface I{{ModuleName}}Model extends Model<I{{ModuleName}}> {
  isExist(id: string): Promise<boolean>;
}
`;
