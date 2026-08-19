import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastJobItemOrder } from '../utils/dataUtils';
import { Prisma } from '../../generated/prisma';
import z from 'zod';
import { createJobItemSchema } from '../validators/jobItemValidators';
import { reorderJobItems } from '../utils/jobItemUtils';
import { Action } from '../utils/types';
import { AppError } from '../utils/errors';

const createJobItem = async (
  req: Request<{}, {}, z.infer<typeof createJobItemSchema>>,
  res: Response,
  next: NextFunction,
) => {
  console.log('create jobItem reached');
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      throw new AppError('internal error: user not found', 500);
    }
    //destructure body
    const {
      columnId,
      company,
      title,
      deadline,
      notes,
      priority,
      minSalary,
      maxSalary,
      order,
    } = req.body;
    console.log('req.body', req.body);
    //check if column exists
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { user: true },
    });
    if (!column) {
      throw new AppError('column not found', 404);
    }
    //check if user is authorized
    if (column.user.id !== req.user.id) {
      throw new AppError('User not authorized', 403);
    }
    //find order of last job item
    const greatestOrder = await lastJobItemOrder(columnId);
    //calculate order of new jobItem
    const targetOrder =
      order && order < greatestOrder + 1 ? order : greatestOrder + 1;

    const result = await prisma.$transaction(async (tx) => {
      //adjust order of current jobItems IF necesary
      if (targetOrder !== greatestOrder + 1) {
        await reorderJobItems({ targetOrder, columnId, tx }, 'CREATE');
      }
      //create jobItem
      const jobItem = await tx.jobItem.create({
        data: {
          columnId,
          company,
          title,
          deadline,
          notes,
          priority,
          order: targetOrder,
          minSalary,
          maxSalary,
        },
      });
      const newColumns = await tx.column.findMany({
        where: { userId: req.user?.id },
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { jobItems: true } },
          jobItems: {
            orderBy: { order: 'asc' },
            include: { offer: true },
          },
        },
      });
      return newColumns;
    });
    //send response
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

const removeJobItem = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    //confirm that auth middleware attached user to req body
    if (!req.user?.id) {
      throw new AppError('internal error: user not found', 500);
    }
    // get jobItem AND column from id param
    const jobItem = await prisma.jobItem.findUnique({
      where: { id: req.params.id },
      include: { column: true }, // fetch the column in the same query
    });
    //check if jobItem exists
    if (!jobItem) {
      throw new AppError('job item not found', 404);
    }
    const columnId = jobItem.column.id;
    //check if user is authorized
    if (jobItem.column.userId !== req.user.id) {
      throw new AppError('Not authorized: invalid user', 403);
    }
    const result = await prisma.$transaction(async (tx) => {
      //delete jobItem
      const deletedJobItem = await tx.jobItem.delete({
        where: { id: req.params.id },
      });
      //adjust items with affected orders
      await reorderJobItems(
        {
          targetOrder: deletedJobItem.order,
          columnId: columnId,
          tx,
        },
        'REMOVE',
      );

      const newColumns = await tx.column.findMany({
        where: { userId: req.user?.id },
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { jobItems: true } },
          jobItems: {
            orderBy: { order: 'asc' },
            include: { offer: true },
          },
        },
      });
      return newColumns;
    });

    //send response
    res.status(200).json({
      status: 'Success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateJobItem = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user) {
      throw new AppError('internal error: user not found', 500);
    }
    //destructure body
    const {
      columnId,
      company,
      title,
      deadline,
      priority,
      notes,
      order,
      minSalary,
      maxSalary,
    } = req.body;

    //get jobItem with id param
    const jobItem = await prisma.jobItem.findUnique({
      where: {
        id: req.params.id,
      },
      include: { column: true },
    });
    console.log('jobItem: ', jobItem);
    console.log('id: ', req.user.id);
    //check if jobItem exists
    if (!jobItem) {
      throw new AppError('job item not found', 404);
    }

    //check if user is authorized
    if (jobItem.column.userId !== req.user.id) {
      throw new AppError('Not authorized: invalid user', 403);
    }
    // Determine the active destination column (default to current column if none provided)
    const targetColumnId = columnId !== undefined ? columnId : jobItem.columnId;

    // If we are changing columns, verify the target column belongs to the user
    if (targetColumnId !== jobItem.columnId) {
      const targetColumn = await prisma.column.findUnique({
        where: { id: targetColumnId },
      });

      if (!targetColumn || targetColumn.userId !== req.user.id) {
        throw new AppError(
          'Forbidden: target column not found or not owned by user',
          403,
        );
      }
    }
    //find order of last column
    const greatestOrder = await lastJobItemOrder(targetColumnId);
    //calculate order of new column
    const targetOrder =
      order !== undefined && order <= greatestOrder + 1
        ? order
        : greatestOrder + 1;

    //If the jobItem is moved to a new column, set the original order to be at the end of the new column
    const originalOrder =
      targetColumnId !== jobItem.columnId ? greatestOrder + 1 : jobItem.order;

    const result = await prisma.$transaction(async (tx) => {
      const isMovingColumns = targetColumnId !== jobItem.columnId;
      const isOrderChanged =
        order !== undefined && targetOrder !== originalOrder;
      //Check if column OR order is changing
      if (isMovingColumns || isOrderChanged) {
        //1. set order to 'safe' negative value
        await tx.jobItem.update({
          where: { id: jobItem.id },
          data: { order: -1, columnId: targetColumnId },
        });
        //2. reorder affected jobItems
        const action: Action =
          targetOrder > jobItem.order ? 'INCREASE' : 'DECREASE';
        await reorderJobItems(
          {
            originalOrder,
            targetOrder,
            columnId: targetColumnId,
            tx,
          },
          action,
        );
      }
      // edit job item

      const updateData: Prisma.JobItemUpdateInput = {};
      if (isMovingColumns) {
        updateData.column = { connect: { id: targetColumnId } };
      }

      if (company != undefined) updateData.company = company;
      if (title != undefined) updateData.title = title;
      if (deadline != undefined) updateData.deadline = deadline;
      if (notes != undefined) updateData.notes = notes;
      updateData.order = targetOrder;
      if (priority != undefined) updateData.priority = priority;
      if (minSalary != undefined) updateData.minSalary = minSalary;
      if (maxSalary != undefined) updateData.maxSalary = maxSalary;

      //update jobItem
      await tx.jobItem.update({
        where: { id: req.params.id },
        data: updateData,
      });
      console.log(updateData);
      const newColumns = await tx.column.findMany({
        where: { userId: req.user?.id },
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { jobItems: true } },
          jobItems: {
            orderBy: { order: 'asc' },
            include: { offer: true },
          },
        },
      });
      return newColumns;
    });

    //return response
    res.status(200).json({
      status: 'Success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getJobItem = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      throw new AppError('internal error: user not found', 500);
    }

    const jobItem = await prisma.jobItem.findUnique({
      where: { id: req.params.id },
      include: {
        column: true,
        offer: true,
      },
    });

    //check if jobItem exists
    if (!jobItem) {
      throw new AppError('job item not found', 404);
    }
    //verify that column exists
    if (!jobItem.column) {
      throw new AppError('column not found', 404);
    }
    //check if user is authorized to view column
    if (jobItem.column.userId !== req.user.id) {
      throw new AppError('not authorized', 403);
    }
    res.status(200).json({ status: 'success', data: jobItem });
  } catch (error) {
    next(error);
  }
};

export { createJobItem, removeJobItem, updateJobItem, getJobItem };
