import mongoose, { Schema } from 'mongoose';
import { thirtyDaysFromNow } from '@/common/utils/date-time';
import { ISession } from './session.interface';

const sessionSchema = new Schema<ISession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  userAgent: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiredAt: {
    type: Date,
    required: true,
    default: thirtyDaysFromNow
  }
});

const Session = mongoose.model<ISession>('Session', sessionSchema);

export default Session;
