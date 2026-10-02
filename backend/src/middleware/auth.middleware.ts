import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Support both HTTP-only cookie and Authorization header Bearer token
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};
