import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodTypeAny } from 'zod';

const validate =
  (schema: AnyZodObject | ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (err) {
      next(err);
    }
  };

export default validate;
