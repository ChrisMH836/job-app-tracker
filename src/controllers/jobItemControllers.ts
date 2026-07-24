import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { lastJobItemOrder } from '../utils/dataUtils';
import { Prisma } from '../../generated/prisma';
import z from 'zod';
import { createJobItemSchema } from '../validators/jobItemValidators';

const createJobItem = async (
  req: Request<{}, {}, z.infer<typeof createJobItemSchema>>,
  res: Response,
) => {
  // confirm that auth middleware inserted user
  if (!req.user) {
    return res.status(500).json({
      error: 'internal error: user not found',
    });
  }
  //destructure body
  const { columnId, company, title, deadline, notes, status } = req.body;

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
  //create order
  const newOrder = await lastJobItemOrder(columnId);
  //create jobItem
  const jobItem = await prisma.jobItem.create({
    data: {
      columnId,
      company,
      title,
      deadline,
      notes,
      status,
      order: newOrder,
    },
  });
  //send response
  res.status(201).json({ status: 'success', data: jobItem });
};

const removeJobItem = async (req: Request<{ id: string }>, res: Response) => {
  // get jobItem from id param
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
  //delete jobItem
  const deletedJobItem = await prisma.jobItem.delete({
    where: { id: req.params.id },
  });
  //send response
  res.status(201).json({
    status: 'Success',
    data: deletedJobItem,
  });
};

const updateJobItem = async (req: Request<{ id: string }>, res: Response) => {
  //destructure body
  const { columnId, company, title, deadline, notes } = req.body;

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
  // edit job item
  const updateData: Prisma.JobItemUpdateInput = {};
  if (columnId != undefined) updateData.column = { connect: { id: columnId } };
  if (company != undefined) updateData.company = company;
  if (title != undefined) updateData.title = title;
  if (deadline != undefined) updateData.deadline = deadline;
  if (notes != undefined) updateData.notes = notes;

  const updatedJobItem = await prisma.jobItem.update({
    where: { id: req.params.id },
    data: updateData,
  });
  //return response
  res.status(201).json({
    status: 'Success',
    data: updatedJobItem,
  });
};

export { createJobItem, removeJobItem, updateJobItem };
