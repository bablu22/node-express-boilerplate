import asyncHandler from '@/middlewares/asyncHandler';
import { RequestHandler } from 'express';
import sendResponse from '@/common/utils/sendResponse';
import { sessionService } from './session.service';

const getAllSession: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const sessionId = req.sessionId;

  const sessions = await sessionService.getAllSessions(userId as string);

  const modifySessions = sessions.map((session) => ({
    ...session.toObject(),
    ...(session.id === sessionId && {
      isCurrent: true
    })
  }));

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Retrieved all sessions successfully',
    data: modifySessions
  });
});

const getSession: RequestHandler = asyncHandler(async (req, res) => {
  const sessionId = req.sessionId;

  const user = await sessionService.getSessionById(sessionId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Retrieved session successfully',
    data: user
  });
});

const deleteSession: RequestHandler = asyncHandler(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user?.id;
  const deletedSession = await sessionService.deleteSession(sessionId as string, userId as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Session deleted successfully',
    data: deletedSession
  });
});

export const sessionController = {
  getAllSession,
  getSession,
  deleteSession
};
