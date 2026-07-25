import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastJobItemOrder } from '../utils/dataUtils';
import { JobItem, Prisma } from '../../generated/prisma';
import z from 'zod';
import { createJobItemSchema } from '../validators/jobItemValidators';
import { reorderJobItems } from '../utils/jobItemUtils';
import { Action } from '../utils/types';

const createJobItem = async (
  req: Request<{}, {}, z.infer<typeof createJobItemSchema>>,
  res: Response,
) => {
  // confirm that auth middleware inserted user
  if (!req.user?.id) {
    return res.status(500).json({
      error: 'internal error: user not found',
    });
  }
  //destructure body
  const { columnId, company, title, deadline, notes, status, order } = req.body;

  //check if column exists
  const column = await prisma.column.findUnique({
    where: { id: columnId },
  });

  if (!column) {
    return res.status(404).json({
      error: 'column not found',
    });
  }
  //check if user is authorized
  if (column.userId !== req.user.id) {
    return res.status(401).json({
      error: 'Not authorized: invalid user',
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
      },
    });
    return jobItem;
  });
  //send response
  res.status(201).json({ status: 'success', data: result });
};

const removeJobItem = async (req: Request<{ id: string }>, res: Response) => {
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
  //check if user is authorized
  if (jobItem.column.userId !== req.user.id) {
    return res.status(401).json({
      error: 'Not authorized: invalid user',
    });
  }
  const result = await prisma.$transaction(async (tx) => {
    //delete jobItem
    const deletedJobItem = await prisma.jobItem.delete({
      where: { id: req.params.id },
    });
    //adjust items with affected orders
    await reorderJobItems(
      {
        targetOrder: deletedJobItem.order,
        columnId: deletedJobItem.columnId,
        tx,
      },
      'REMOVE',
    );

    return deletedJobItem;
  });

  //send response
  res.status(201).json({
    status: 'Success',
    data: result,
  });
};

const updateJobItem = async (req: Request<{ id: string }>, res: Response) => {
  //destructure body
  const { columnId, company, title, deadline, notes, order } = req.body;

  //get jobItem with id param
  const jobItem = await prisma.jobItem.findUnique({
    where: {
      id: req.params.id,
    },
  });
  //check if jobItem exists
  if (!jobItem) {
    return res.status(404).json({
      error: 'job item not found',
    });
  }
  //see if order changes
  const result = await prisma.$transaction(async (tx) => {
    if (order !== undefined && order !== jobItem.order) {
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
          targetOrder: order,
          columnId: jobItem.columnId,
          tx,
        },
        action,
      );
    }
    // edit job item
    const updateData: Prisma.JobItemUpdateInput = {};
    if (columnId != undefined)
      updateData.column = { connect: { id: columnId } };
    if (company != undefined) updateData.company = company;
    if (title != undefined) updateData.title = title;
    if (deadline != undefined) updateData.deadline = deadline;
    if (notes != undefined) updateData.notes = notes;
    console.log(`ORDER: ${order}`);
    if (order != undefined) updateData.order = order;

    const updatedJobItem = await tx.jobItem.update({
      where: { id: req.params.id },
      data: updateData,
    });
    return updatedJobItem;
  });

  //return response
  res.status(201).json({
    status: 'Success',
    data: result,
  });
};

export { createJobItem, removeJobItem, updateJobItem };
