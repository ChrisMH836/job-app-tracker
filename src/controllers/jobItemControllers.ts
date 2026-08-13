import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastJobItemOrder } from '../utils/dataUtils';
import { Prisma } from '../../generated/prisma';
import z from 'zod';
import { createJobItemSchema } from '../validators/jobItemValidators';
import { reorderJobItems } from '../utils/jobItemUtils';
import { Action } from '../utils/types';

const createJobItem = async (
  req: Request<{}, {}, z.infer<typeof createJobItemSchema>>,
  res: Response,
) => {
  console.log('create jobItem reached');
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      return res.status(500).json({
        error: 'internal error: user not found',
      });
    }
    //destructure body
    const {
      columnId,
      company,
      title,
      deadline,
      notes,
      status,
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
    console.log('column ', column);
    if (!column) {
      return res.status(404).json({
        error: 'column not found',
      });
    }
    //check if user is authorized
    if (column.user.id !== req.user.id) {
      return res.status(403).json({
        error: 'User not authorized',
      });
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
          status,
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
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

const removeJobItem = async (req: Request<{ id: string }>, res: Response) => {
  try {
    //confirm that auth middleware attached user to req body
    if (!req.user?.id) {
      return res.status(500).json({
        error: 'internal error: user not found',
      });
    }
    // get jobItem AND column from id param
    const jobItem = await prisma.jobItem.findUnique({
      where: { id: req.params.id },
      include: { column: true }, // fetch the column in the same query
    });
    //check if jobItem exists
    if (!jobItem) {
      return res.status(404).json({
        error: 'job item not found',
      });
    }
    const columnId = jobItem.column.id;
    //check if user is authorized
    if (jobItem.column.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Not authorized: invalid user',
      });
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
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

const updateJobItem = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user) {
      return res.status(500).json({
        error: 'internal error: user not found',
      });
    }
    //destructure body
    const {
      columnId,
      company,
      title,
      deadline,
      notes,
      order,
      minSalary,
      maxSalary,
    } = req.body;

    //find order of last column
    const greatestOrder = await lastJobItemOrder(columnId);
    //calculate order of new column
    const targetOrder =
      order && order <= greatestOrder + 1 ? order : greatestOrder + 1;
    //get jobItem with id param
    const jobItem = await prisma.jobItem.findUnique({
      where: {
        id: req.params.id,
      },
      include: { column: true },
    });
    //check if jobItem exists
    if (!jobItem) {
      return res.status(404).json({
        error: 'job item not found',
      });
    }
    //check if user is authorized
    if (jobItem.column.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Not authorized: invalid user',
      });
    }
    const result = await prisma.$transaction(async (tx) => {
      //check if order is updarted
      if (order !== undefined && targetOrder !== jobItem.order) {
        //set order to 'safe' negative value
        await tx.jobItem.update({
          where: { id: jobItem.id },
          data: { order: -1 },
        });
        //reorder affected jobItems
        const action: Action = order > jobItem.order ? 'INCREASE' : 'DECREASE';
        await reorderJobItems(
          {
            originalOrder: jobItem.order,
            targetOrder: targetOrder,
            columnId: jobItem.columnId,
            tx,
          },
          action,
        );
      }
      // edit job item

      const updateData: Prisma.JobItemUpdateInput = {};
      if (columnId != undefined && columnId !== jobItem.columnId) {
        updateData.column = { connect: { id: columnId } };
      }

      if (company != undefined) updateData.company = company;
      if (title != undefined) updateData.title = title;
      if (deadline != undefined) updateData.deadline = deadline;
      if (notes != undefined) updateData.notes = notes;
      if (order != undefined) updateData.order = targetOrder;
      if (minSalary != undefined) updateData.minSalary = minSalary;
      if (maxSalary != undefined) updateData.maxSalary = maxSalary;

      //update jobItems
      const updatedJobItem = await tx.jobItem.update({
        where: { id: req.params.id },
        data: updateData,
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
const getJobItem = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // confirm that auth middleware inserted user
    if (!req.user?.id) {
      res.status(500).json({ error: 'internal error: user not found' });
      return;
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
      res.status(404).json({ error: 'job item not found' });
      return;
    }
    //verify that column exists
    if (!jobItem.column) {
      return res.status(404).json({
        error: 'column not found',
      });
    }
    //check if user is authorized to view column
    if (jobItem.column.userId !== req.user.id) {
      return res.status(403).json({
        error: 'not authorized',
      });
    }
    res.status(200).json({ status: 'success', data: jobItem });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'unknown error',
    });
  }
};

export { createJobItem, removeJobItem, updateJobItem, getJobItem };
