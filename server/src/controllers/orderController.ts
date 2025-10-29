import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { orderService, CreateOrderData } from '../services/orderService';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1')
  })).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required')
  }),
  paymentMethod: z.enum(['stripe', 'iyzico', 'cash'], {
    errorMap: () => ({ message: 'Payment method must be stripe, iyzico, or cash' })
  })
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status' })
  })
});

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const data = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(userId, data);
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const orders = await orderService.getOrdersByUser(userId);
    
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    
    const order = await orderService.getOrderById(id, userId);
    
    if (!order) {
      const error = new Error('Order not found') as any;
      error.status = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = updateStatusSchema.parse(req.body);
    
    const order = await orderService.updateOrderStatus(id, status);
    
    if (!order) {
      const error = new Error('Order not found') as any;
      error.status = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, transactionId } = req.body;
    
    if (!status || !['pending', 'paid', 'failed', 'refunded'].includes(status)) {
      const error = new Error('Invalid payment status') as any;
      error.status = 400;
      error.code = 'INVALID_PAYMENT_STATUS';
      throw error;
    }
    
    const order = await orderService.updatePaymentStatus(id, status, transactionId);
    
    if (!order) {
      const error = new Error('Order not found') as any;
      error.status = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getAllOrders();
    
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};
