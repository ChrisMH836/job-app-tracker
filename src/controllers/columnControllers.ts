import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastColumnOrder } from '../utils/dataUtils';
import { Prisma } from '../../generated/prisma';
import { reorderColumns } from '../utils/columnUtils';

const createColumn = async (req: Request, res: Response) => {
  // confirm that auth middleware inserted user
  if (!req.user?.id) {
    return res.status(500).json({
      error: 'internal error: user not found',
    });
  }
  //destructure request
  const userId = req.user.id;
  const { name, order } = req.body;
  //  check if user exists

  const userExists = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!userExists) {
    return res.status(404).json({
      error: 'user not found',
    });
  }
  //find order of last column
  const greatestOrder = await lastColumnOrder(userId);
  //calculate order of new column
  const targetOrder =
    order && order <= greatestOrder + 1 ? order : greatestOrder + 1;
  const result = await prisma.$transaction(async (tx) => {
    if (targetOrder !== greatestOrder + 1) {
      await reorderColumns({ targetOrder, userId, tx }, 'CREATE');
    }
    //  create column
    const column = await tx.column.create({
      data: {
        name,
        userId: userId,
        order: targetOrder,
        jobCount: 0,
      },
    });
    return column;
  });

  //return response
  res.status(201).json({
    status: 'success',
    data: result,
  });
};

const removeColumn = async (req: Request<{ id: string }>, res: Response) => {
  // confirm that auth middleware inserted user
  if (!req.user) {
    return res.status(500).json({
      error: 'internal error: user not found',
    });
  }
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
  // confirm that auth middleware inserted user
  if (!req.user) {
    return res.status(500).json({
      error: 'internal error: user not found',
    });
  }
  //destructure body
  const { name } = req.body;

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
  if (req.user.id != undefined)
    updateData.user = { connect: { id: req.user.id } };
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
