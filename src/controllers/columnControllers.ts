import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastColumnOrder } from '../utils/dataUtils';

const createColumn = async (req: Request, res: Response) => {
  const { name, userId } = req.body;
  //  check if user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    return res.status(404).json({
      error: 'user not found',
    });
  }
  //calculate order
  const newOrder = await lastColumnOrder(userId);
  //  create column
  const column = await prisma.column.create({
    data: {
      name,
      userId,
      order: newOrder,
      jobCount: 0,
    },
  });
  //return response
  res.status(201).json({
    status: 'success',
    data: column,
  });
};
export { createColumn };
