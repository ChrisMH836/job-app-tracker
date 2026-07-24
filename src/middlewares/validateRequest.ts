import { NextFunction, Request, Response } from 'express';
import { ZodType, z } from 'zod';

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //check if request has proper types
    const result = schema.safeParse(req.body);

    //handles improper requests
    if (!result.success) {
      // extract errors
      const flattened = z.flattenError(result.error);

      const errorMessages = Object.values(flattened.fieldErrors).flat();
      return res.status(400).json({
        message: errorMessages.join(', '),
      });
    }
    next();
  };
};
