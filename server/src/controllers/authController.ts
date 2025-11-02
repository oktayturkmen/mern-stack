import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';
import { User } from '../models/User';
import { isProd } from '../config/env';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  gender: z.enum(['female', 'male', 'other']).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, gender } = registerSchema.parse(req.body);
    
    const user = await authService.register(name, email, password, phone, gender);
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
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        gender: user.gender,
        role: user.role, 
        addresses: user.addresses 
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

const addAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional()
});

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const addressData = addAddressSchema.parse(req.body);
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // If this is set as default, remove default from other addresses
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(addressData);
    await user.save();

    res.status(201).json({
      message: 'Address added successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, addresses: user.addresses }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const addressId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    user.addresses = user.addresses.filter((addr, index) => index !== parseInt(addressId));
    await user.save();

    res.status(200).json({
      message: 'Address deleted successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, addresses: user.addresses }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
  gender: z.enum(['female', 'male', 'other']).optional(),
  surname: z.string().optional(),
  birthDate: z.string().optional()
});

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const profileData = updateProfileSchema.parse(req.body);
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found') as any;
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Update fields
    if (profileData.name !== undefined) user.name = profileData.name;
    if (profileData.email !== undefined) user.email = profileData.email;
    if (profileData.phone !== undefined) user.phone = profileData.phone;
    if (profileData.gender !== undefined) user.gender = profileData.gender;
    
    // Handle surname and birthDate if they exist in schema (they might need to be added to User model)
    // For now, we'll skip them if they're not in the model
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: { 
        id: userObj._id, 
        name: userObj.name, 
        email: userObj.email, 
        phone: userObj.phone,
        gender: userObj.gender,
        role: userObj.role, 
        addresses: userObj.addresses 
      }
    });
  } catch (error) {
    next(error);
  }
};
