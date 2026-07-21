import { Request, Response } from 'express';
import { prisma } from '../config/db';
import bcrypt from 'bcrypt';

const register = async (req: Request, res: Response) => {
  //destructure body
  const { email, password, name } = req.body;
  //check if email is available
  const emailExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (emailExists) {
    return res
      .status(409)
      .json({ error: 'Account already exists with that email' });
  }
  //create user
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  //return success response
  res.status(201).json({
    status: 'Success',
    data: {
      user: {
        name,
        email,
        id: user.id,
      },
    },
  });
};

export default register;
