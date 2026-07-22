import { Request, Response } from 'express';
import { prisma } from '../config/db';

const createJobItem = async (req: Request, res: Response) => {
  //destructure body
  const { userId, company, title, deadline, notes } = req.body;

  //check if user exists
  const userExists = await prisma.user.findUnique({ where: { id: userId } });

  if (!userExists) {
    return res.status(404).json({
      error: 'user not found',
    });
  }
  //create jobItem
  const jobItem = await prisma.jobItem.create({
    data: {
      userId,
      company,
      title,
      deadline,
      notes,
    },
  });
  //send response
  res.status(201).json({ status: 'success', data: jobItem });
};

export { createJobItem };
