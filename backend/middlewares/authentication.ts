import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user';

interface Token {
  id: string;
  iat: number;
  exp: number;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as Token;
        const tempUser = await User.findById(decoded.id);
        if (tempUser) {
          req.user = {
            id: tempUser.id,
            iat: decoded.iat,
            exp: decoded.exp,
            name: tempUser.username,
          };
        } else {
          res.status(401);
          throw new Error('Not authorized');
        }

        next();
        return;
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not Authorized, bad token');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);
