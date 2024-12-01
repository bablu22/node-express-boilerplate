import { IUser } from './src/modules/User/user.interface';

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      sessionId?: string;
    }
  }
}
