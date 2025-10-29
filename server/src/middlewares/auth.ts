import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      const error = new Error('No token provided') as any;
      error.status = 401;
      error.code = 'NO_TOKEN';
      throw error;
    }

    const decoded = authService.verifyToken(token);
    if (!decoded) {
      const error = new Error('Invalid token') as any;
      error.status = 401;
      error.code = 'INVALID_TOKEN';
      throw error;
    }

    const user = await User.findById(decoded.userId).select('role');
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 401;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    req.user = {
      userId: decoded.userId,
      role: user.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const admin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    if (req.user.role !== 'admin') {
      const error = new Error('Admin access required') as any;
      error.status = 403;
      error.code = 'ADMIN_REQUIRED';
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};
