import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastColumnOrder } from '../utils/dataUtils';
import { Prisma } from '../../generated/prisma';
import { reorderColumns } from '../utils/columnUtils';
import { Action } from '../utils/types';

const createColumn = async (req: Request, res: Response) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      return res.status(500).json({
        error: 'internal error: user not found',
      });
    }
    //destructure request
    const userId = req.user.id;
    const { name, order } = req.body;
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
          userId,
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
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

const removeColumn = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
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
        error: 'User not authorized',
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
    res.status(200).json({
      status: 'Success',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

const updateColumn = async (req: Request<{ id: string }>, res: Response) => {
  try {
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
        error: 'Column not found',
      });
    }
    //check if user is authorized
    if (column.userId !== userId) {
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
      if (name !== undefined) updateData.name = name;
      if (order !== undefined && order !== column.order)
        updateData.order = order;

      const updatedColumn = await tx.column.update({
        where: { id: req.params.id },
        data: updateData,
      });
      //update jobCount
      return updatedColumn;
    });

    //return response
    res.status(200).json({
      status: 'Success',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

const getColumns = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(500).json({
        error: 'internal error: user not found',
      });
    }
    const columns = await prisma.column.findMany({
      where: { userId: req.user.id },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { jobItems: true } },
        jobItems: {
          orderBy: { order: 'asc' },
        },
      },
    });
    res.status(200).json({ status: 'success', data: columns });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};
const getColumn = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(500).json({ error: 'internal error: user not found' });
      return;
    }

    const column = await prisma.column.findUnique({
      where: { id: req.params.id },
      include: {
        jobItems: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!column) {
      res.status(404).json({ error: 'column not found' });
      return;
    }

    if (column.userId !== req.user.id) {
      res.status(403).json({ error: 'not authorized' });
      return;
    }

    res.status(200).json({ status: 'success', data: column });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};
export { createColumn, removeColumn, updateColumn, getColumns, getColumn };
