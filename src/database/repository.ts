import EventManager from '@/common/utils/event-manager';
import mongoose from 'mongoose';

const eventEmitter = new EventManager().getInstance();

interface ModelData {
  [key: string]: any;
}

// Fetch a single document based on a query
export const searchOne = async (query: ModelData, modelName: string): Promise<any> => {
  // Add error checking for model existence
  if (!mongoose.models[modelName]) {
    console.error(`Model ${modelName} is not registered`);
    console.error('Registered models:', Object.keys(mongoose.models));
    throw new Error(`Model ${modelName} is not registered`);
  }

  try {
    const data = await mongoose.models[modelName].findOne(query).lean().exec();
    return data;
  } catch (error) {
    console.error(`Error in searchOne for model ${modelName}:`, error);
    throw error;
  }
};

// Update multiple documents based on a query
export const updateAll = async (
  query: ModelData,
  updateModel: ModelData,
  modelName: string
): Promise<any> => {
  const doc = await mongoose.models[modelName].updateMany(query, updateModel);
  eventEmitter.emit(`${modelName}Updated`, doc);
  return doc;
};

// Save a new document to the database
export const save = async (saveModel: ModelData, modelName: string): Promise<any> => {
  const model = new mongoose.models[modelName](saveModel);
  const savedDoc = await model.save();
  eventEmitter.emit(`${modelName}Created`, savedDoc);
  return savedDoc;
};

// Update a single document based on a query
export const update = async (
  query: ModelData,
  updateModel: ModelData,
  modelName: string
): Promise<any> => {
  const doc = await mongoose.models[modelName]
    .findOneAndUpdate(query, updateModel, { new: true })
    .exec();
  eventEmitter.emit(`${modelName}Updated`, doc);
  return doc;
};

// Delete multiple documents based on a query
export const deleteAll = async (query: ModelData, modelName: string): Promise<any> => {
  const result = await mongoose.models[modelName].deleteMany(query).exec();
  eventEmitter.emit(`${modelName}Deleted`, result);
  return result;
};

// Delete a single document by its ID
export const deleteById = async (id: string, modelName: string): Promise<any> => {
  const result = await mongoose.models[modelName].findByIdAndDelete(id).exec();
  eventEmitter.emit(`${modelName}Deleted`, result);
  return result;
};

// Fetch a single document by its ID
export const getById = async (id: string, modelName: string): Promise<any> => {
  const doc = await mongoose.models[modelName].findById(id).lean().exec();
  return doc;
};
