import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { Prisma } from '../../generated/prisma';
import bcrypt from 'bcrypt';

const updateMe = async (req: Request, res: Response) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      return res.status(500).json({
        error: 'internal error: user not found',
      });
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
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      return res.status(500).json({
        error: 'internal error: user not found',
      });
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
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

const deleteMe = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(500).json({
        error: 'internal error: user not found',
      });
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
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(500).json({ error: 'internal error: user not found' });
      return;
    }

    const { password, ...userWithoutPassword } = req.user;

    res.status(200).json({
      status: 'success',
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

export { updateMe, updatePassword, deleteMe, getMe };
