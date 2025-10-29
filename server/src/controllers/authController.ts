import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';
import { User } from '../models/User';
import { isProd } from '../config/env';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    
    const user = await authService.register(name, email, password);
    const token = authService.generateToken(user._id.toString());
    
    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await authService.login(email, password);
    const token = authService.generateToken(user._id.toString());
    
    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, addresses: user.addresses }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};
