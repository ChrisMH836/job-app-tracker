import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv';
import { prisma } from '../config/db';
import { User } from '../../generated/prisma';
import { AppError } from '../utils/errors';

interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('auth middleware reached, body: ', req.body);
  if (!process.env.JWT_SECRET) {
    console.log('JWT not configured');
    throw new AppError('internal error: Please try again later', 500);
  }
  // check if token is passed
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    throw new AppError('Not Authorized: No authorization token provided', 401);
  }
  //verify token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      throw new AppError('user does not exist anymore', 401);
    }
    //return userId
    req.user = user;
    console.log('auth middleware ended');
    next();
  } catch (error) {
    // Catches TokenExpiredError or JsonWebTokenError from jwt.verify()
    return res.status(401).json({ error: 'Not Authorized: Invalid token' });
  }
};
