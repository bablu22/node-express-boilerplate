import { IUser } from '../modules/user/user.interface';
import { ILogger } from '@/common/utils/logger';

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      sessionId?: string;
      log: ILogger;
    }
  }
}

export {};
