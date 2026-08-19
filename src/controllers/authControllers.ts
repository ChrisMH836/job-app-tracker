import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/db';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generatetoken';
import { AppError } from '../utils/errors';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //destructure body
    const { email, password, name } = req.body;
    //check if email is available
    const emailExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (emailExists) {
      throw new AppError('Account already exists with this email', 409);
    }
    //create user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    //return success response
    res.status(201).json({
      status: 'Success',
      data: {
        user: {
          name,
          email,
          id: user.id,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // destructure body
    const { email, password } = req.body;

    //check if email exists in db

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new AppError('Invalid Email or password', 401);
    }
    //check if password hashes are the same
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid Email or password', 401);
    }
    //generate jwt token
    const token = generateToken(user.id, res);
    //send response and token as cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({
      status: 'Success',
      data: {
        user: {
          email,
          name: user.name,
          token,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    {
      res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({
        status: 'success',
        message: 'logged out successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};
export { register, login, logout };
