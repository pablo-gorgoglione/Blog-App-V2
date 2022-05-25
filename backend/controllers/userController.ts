import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { Response, Request } from 'express';
import User from '../models/user';
import generateToken from '../utils/userUtils';
import { IUser } from '../types';
interface UserToSend {
  id: string;
  username: string;
  token: string;
  isAdmin: boolean;
}
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

  const user = await User.findOne({ username }).select(
    '-createdAt -updatedAt -__v'
  );

  if (user && (await bcrypt.compare(password, user.password))) {
    const userToSend: UserToSend = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    };
    res.status(200).json(userToSend);
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

// @route PUT /api/users/:id
// @acess Private/Admin
export const putUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { isAdmin = false } = req.body;
  if (typeof isAdmin !== 'undefined') {
    throw new Error('Missing value');
  }
  if (typeof isAdmin !== 'boolean') {
    throw new Error('Value must be boolean.');
  }
  const user = await searchUserById(req.params.id);
  user.isAdmin = isAdmin;
  await user.save();
  const { password, ...restOfUser } = user.toJSON();
  res.json(restOfUser);
  return;
});

// @route PUT /api/users/:id
// @acess Private/Admin
export const putUser = asyncHandler(async (req: Request, res: Response) => {
  const { password: pw, username } = req.body;
  const user = await searchUser(req);
  if (pw) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(pw, salt);
    user.password = hashPassword;
  }
  user.username = username ? username : user.username;
  await user.save();
  const { password, ...restOfUser } = user.toJSON();
  res.json(restOfUser);
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

export const searchUserById = async (id: string): Promise<IUser> => {
  if (!id) {
    throw new Error('Missing user id');
  }
  const user: IUser | null = await User.findById(id);
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
