export const modelTemplate = ` 
import { Schema, model } from 'mongoose';
import { I{{ModuleName}} , I{{ModuleName}}Model } from './{{moduleName}}.interface';

const {{ModuleName}}Schema = new Schema<I{{ModuleName}},I{{ModuleName}}Model>({
  name: {
    type: String,
    required: true,
    unique: true
  }
},{
timestamps: true

});

const {{ModuleName}} = model<I{{ModuleName}}, I{{ModuleName}}Model>('{{ModuleName}}', {{ModuleName}}Schema);
export default {{ModuleName}};
`;
