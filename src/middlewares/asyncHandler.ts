import { NextFunction, Request, Response } from 'express';

type AsyncControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler =
  (controller: AsyncControllerType): AsyncControllerType =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default asyncHandler;
