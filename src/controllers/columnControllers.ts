import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastColumnOrder } from '../utils/dataUtils';
import { Prisma } from '../../generated/prisma';

const createColumn = async (req: Request, res: Response) => {
  const { name } = req.body;
  //  check if user exists
  const userExists = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!userExists) {
    return res.status(404).json({
      error: 'user not found',
    });
  }
  //calculate order
  const newOrder = await lastColumnOrder(req.user.id);
  //  create column
  const column = await prisma.column.create({
    data: {
      name,
      userId: req.user.id,
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

const removeColumn = async (req: Request<{ id: string }>, res: Response) => {
  // get column from id param
  const column = await prisma.column.findUnique({
    where: {
      id: req.params.id,
    },
  });
  //check if column exists
  if (!column) {
    return res.status(404).json({
      error: 'job item not found',
    });
  }
  //check if user is authorized

  if (column.userId !== req.user.id) {
    return res.status(401).json({
      error: 'Not authorized: invalid user',
    });
  }
  //delete column
  const deletedColumn = await prisma.column.delete({
    where: { id: req.params.id },
  });
  //send response
  res.status(201).json({
    status: 'Success',
    data: deletedColumn,
  });
};

const updateColumn = async (req: Request<{ id: string }>, res: Response) => {
  //destructure body
  const { userId, name } = req.body;

  //get Column with id param
  const column = await prisma.column.findUnique({
    where: {
      id: req.params.id,
    },
  });
  //check if Column exists
  if (!column) {
    return res.status(404).json({
      error: 'job item not found',
    });
  }
  //check if user is authorized
  if (column.userId !== req.user.id) {
    return res.status(401).json({
      error: 'Not authorized: invalid user',
    });
  }
  // edit job item
  const updateData: Prisma.ColumnUpdateInput = {};
  if (userId != undefined) updateData.user = { connect: { id: userId } };
  if (name != undefined) updateData.name = name;

  const updatedColumn = await prisma.column.update({
    where: { id: req.params.id },
    data: updateData,
  });
  //return response
  res.status(201).json({
    status: 'Success',
    data: updatedColumn,
  });
};
export { createColumn, removeColumn, updateColumn };
