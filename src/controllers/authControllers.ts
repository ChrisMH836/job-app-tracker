import { Request, Response } from 'express';
import { prisma } from '../config/db';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generatetoken';

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

const login = async (req: Request, res: Response) => {
  // destructure body
  const { email, password } = req.body;

  //check if email exists in db
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }
  //check if password hashes are the same
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }
  //generate jwt token
  const token = generateToken(user.id, res);
  //send response and token as cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.json({
    status: 'Success',
    data: {
      user: {
        email,
        name: user.name,
      },
    },
  });
};
const logout = async (req: Request, res: Response) => {
  {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      status: 'success',
      message: 'logged out successfully',
    });
  }
};
export { register, login, logout };
