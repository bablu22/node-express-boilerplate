import { NotFoundException } from '@/common/utils/error';
import Session from './session.model';

const getAllSessions = async (userId: string) => {
  const sessions = await Session.find(
    {
      userId,
      expiredAt: { $gt: Date.now() }
    },
    {
      _id: 1,
      userId: 1,
      userAgent: 1,
      createdAt: 1,
      expiredAt: 1
    },
    {
      sort: {
        createdAt: -1
      }
    }
  );

  return sessions;
};

const getSessionById = async (sessionId: string) => {
  const session = await Session.findById(sessionId)
    .populate([
      {
        path: 'userId',
        populate: {
          path: 'roleId',
          select: 'name alias permissions',
          populate: {
            path: 'permissions',
            select: 'resourceName resourceAlias isAllowed isDisabled'
          }
        }
      }
    ])
    .select('-expiresAt');

  if (!session) {
    throw new NotFoundException('Session not found');
  }
  const { userId: user } = session;

  return user;
};

const deleteSession = async (sessionId: string, userId: string) => {
  const deletedSession = await Session.findByIdAndDelete({
    _id: sessionId,
    userId: userId
  });
  if (!deletedSession) {
    throw new NotFoundException('Session not found');
  }

  return null;
};

export const sessionService = {
  getAllSessions,
  getSessionById,
  deleteSession
};
