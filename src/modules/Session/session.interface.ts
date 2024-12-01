import mongoose, { Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  expiredAt: Date;
  createdAt: Date;
}
