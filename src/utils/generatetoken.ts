import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import 'dotenv';

const generateToken = (userId: string, res: Response) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'FATAL ERROR: JWT_SECRET environment variable is not defined.',
    );
  }
  const payload = {
    id: userId,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7D') as SignOptions['expiresIn'],
  });

  return token;
};

export { generateToken };
