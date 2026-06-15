import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
  };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }
      req.user = decoded as { role: string };
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
}
