import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { Response, Request } from 'express';
import User from '../models/user';
import generateToken from '../utils/userUtils';
import { IUser } from '../types';

// @route POST /api/users/
// @acess Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, password: pw, isAdmin = false } = req.body;

  const inUse = await User.findOne({ username });
  if (inUse) {
    throw new Error('Username already in use.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(pw, salt);

  const user = await User.create({
    username,
    password: hashPassword,
    isAdmin: isAdmin,
  });

  const { password, ...userWithoutPassword } = user.toJSON();

  res.status(201).json(userWithoutPassword);
  return;
});

// @route POST /api/users/login
// @acess Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...userWithoutPassword } = user.toJSON();
    //if there is a user with the email, and the password match then:
    res.status(200).json({
      ...userWithoutPassword,
      token: generateToken(user.id),
    });
    return;
  }
  res.status(401);
  throw new Error('Invalid username or password');
});

// @route GET /api/users/
// @acess Private
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users: IUser[] = await User.find({});
  const usersWithOutPassword = users.map((u) => {
    const { password, ...restOfU } = u.toJSON();
    return restOfU;
  });
  res.status(200).json(usersWithOutPassword);
  return;
});

// @desc Return an User or throws an error for invalid id
export const searchUser = async (req: Request): Promise<IUser> => {
  const userId = req.user ? req.user.id : '';
  if (!userId) {
    throw new Error('Missing or invalid token');
  }
  const user: IUser | null = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// return an arrays of the users that have the isAdmin = true
export const getAdminUsers = async (): Promise<string[]> => {
  const users: IUser[] = await User.find({ isAdmin: true });
  const IdList: string[] = users.map((u) => {
    return u.id;
  });
  return IdList;
};
