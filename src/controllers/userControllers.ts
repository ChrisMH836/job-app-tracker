import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/db';
import { Prisma } from '../../generated/prisma';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/errors';

const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      throw new AppError('internal error: user not found', 500);
    }
    //destructure body
    const { name, email } = req.body;
    const id = req.user.id;

    //updateUser

    const updatedData: Prisma.UserUpdateInput = {};
    if (name !== undefined) updatedData.name = name;
    if (email !== undefined) updatedData.email = email;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    res.status(200).json({
      status: 'Success',
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      throw new AppError('internal error: user not found', 500);
    }
    //destructure body
    const { password } = req.body;
    const id = req.user.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      status: 'Success',
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new AppError('internal error: user not found', 500);
    }
    const deletedUser = await prisma.user.delete({
      where: { id: req.user.id },
    });
    res.status(200).json({
      status: 'Success',
      data: {
        name: deletedUser.name,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError('internal error: user not found', 500);
      return;
    }

    const { password, ...userWithoutPassword } = req.user;

    res.status(200).json({
      status: 'success',
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export { updateMe, updatePassword, deleteMe, getMe };
