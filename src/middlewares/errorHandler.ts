import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  }

  console.error('unhandled error:', err);
  res.status(500).json({ error: 'Internal server error. Please try again.' });
};
