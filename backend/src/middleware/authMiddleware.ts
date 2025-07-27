// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interfața pentru tokenul JWT decodificat
interface DecodedToken {
  role: string;
  id: string;
  [key: string]: any;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    res.status(409).json({ error: 'Please Login First' });
    return;
  }

  try {
    const deCodeToken = jwt.verify(
      accessToken,
      process.env.SECRET as string
    ) as DecodedToken;

    if (deCodeToken.role === 'admin' || deCodeToken.role === 'seller') {
      req.role = deCodeToken.role;
    } else {
      res.status(403).json({ error: 'Unauthorized role' });
      return;
    }

    req.id = deCodeToken.id;

    next();
  } catch (error) {
    res.status(409).json({ error: 'Please Login' });
  }
};
