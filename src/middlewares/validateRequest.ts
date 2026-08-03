import { NextFunction, Request, Response } from 'express';
import { ZodType, z } from 'zod';

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('reached validate request');
    //check if request has proper types
    const result = schema.safeParse(req.body);

    //handles improper requests
    if (!result.success) {
      // extract errors
      const flattened = z.flattenError(result.error);

      const errorMessages = Object.values(flattened.fieldErrors).flat();
      return res.status(400).json({
        error: errorMessages.join(', '),
      });
    }
    console.log('end of validate request');

    next();
  };
};

export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const flattened = z.flattenError(result.error);
      return res.status(400).json({ error: flattened });
    }
    next();
  };
};
