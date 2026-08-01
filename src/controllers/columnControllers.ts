import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastColumnOrder } from '../utils/dataUtils';
import { Prisma } from '../../generated/prisma';
import { reorderColumns } from '../utils/columnUtils';
import { Action } from '../utils/types';

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
      error: 'columns not found',
    });
  }
  //check if user is authorized
  if (column.userId !== req.user.id) {
    return res.status(403).json({
      error: 'Not authorized: invalid user',
    });
  }
  const result = await prisma.$transaction(async (tx) => {
    //delete jobItem
    const deletedColumn = await tx.column.delete({
      where: { id: req.params.id },
    });
    //adjust items with affected orders
    await reorderColumns(
      {
        targetOrder: deletedColumn.order,
        userId: deletedColumn.userId,
        tx,
      },
      'REMOVE',
    );

    return deletedColumn;
  });
  //send response
  res.status(201).json({
    status: 'Success',
    data: result,
  });
};

const updateColumn = async (req: Request<{ id: string }>, res: Response) => {
  // confirm that auth middleware inserted user
  if (!req.user?.id) {
    return res.status(500).json({
      error: 'internal error: user not found',
    });
  }
  const userId = req.user.id;
  //destructure body
  const { name, order } = req.body;

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
    return res.status(403).json({
      error: 'Not authorized: invalid user',
    });
  }
  // edit job item
  const result = await prisma.$transaction(async (tx) => {
    //check if order is updarted
    if (order !== undefined && order !== column.order) {
      //set order to 'safe' negative value
      await tx.column.update({
        where: { id: column.id },
        data: { order: -1 },
      });
      //reorder affected jobItems
      const action: Action = order > column.order ? 'INCREASE' : 'DECREASE';
      await reorderColumns(
        {
          originalOrder: column.order,
          targetOrder: order,
          userId: column.userId,
          tx,
        },
        action,
      );
    }
    // edit column
    const updateData: Prisma.ColumnUpdateInput = {};
    if (userId !== undefined) updateData.user = { connect: { id: userId } };
    if (name !== undefined) updateData.name = name;
    if (order !== undefined && order !== column.order) updateData.order = order;

    const updatedColumn = await tx.column.update({
      where: { id: req.params.id },
      data: updateData,
    });
    //update jobCount
    return updatedColumn;
  });

  //return response
  res.status(201).json({
    status: 'Success',
    data: result,
  });
};
export { createColumn, removeColumn, updateColumn };
