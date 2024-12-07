import { Request, Response } from 'express';

const notFound = async (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'The route you are looking for does not exist!',
    error: {
      path: req.originalUrl,
      method: req.method,
      message: 'You reached a route that is not defined on this server'
    }
  });
};

export default notFound;
