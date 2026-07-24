import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv';
import { prisma } from '../config/db';
import { User } from '../../generated/prisma';

interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('auth middleware reached');
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      error: 'JWT not configured',
    });
  }
  // check if token is passed
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      error: 'Not Authorized: No token provided',
    });
  }
  //verify token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res.status(401).json({ error: 'user no longer exists' });
    }
    //return userId
    req.user = user;
    next();
  } catch (error) {
    // Catches TokenExpiredError or JsonWebTokenError from jwt.verify()
    return res.status(401).json({ error: 'Not Authorized: Invalid token' });
  }
};
