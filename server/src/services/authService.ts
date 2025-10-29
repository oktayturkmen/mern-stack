import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { env } from '../config/env';

export interface AuthService {
  register(name: string, email: string, password: string): Promise<IUser>;
  login(email: string, password: string): Promise<IUser>;
  generateToken(userId: string): string;
  verifyToken(token: string): { userId: string } | null;
}

class AuthServiceImpl implements AuthService {
  async register(name: string, email: string, password: string): Promise<IUser> {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists') as any;
      error.status = 409;
      error.code = 'USER_EXISTS';
      throw error;
    }

    const user = new User({ name, email, password });
    await user.save();
    
    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;
    return userObj as IUser;
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid credentials') as any;
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials') as any;
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;
    return userObj as IUser;
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthServiceImpl();
