import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';

const createPaymentIntentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  paymentMethod: z.enum(['stripe', 'iyzico'], {
    errorMap: () => ({ message: 'Payment method must be stripe or iyzico' })
  })
});

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  paymentMethod: z.enum(['stripe', 'iyzico'], {
    errorMap: () => ({ message: 'Payment method must be stripe or iyzico' })
  })
});

const refundPaymentSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required'),
  amount: z.number().min(0).optional()
});

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const { orderId, paymentMethod } = createPaymentIntentSchema.parse(req.body);
    
    // Verify order belongs to user
    const order = await orderService.getOrderById(orderId, userId);
    if (!order) {
      const error = new Error('Order not found or unauthorized') as any;
      error.status = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    const paymentIntent = await paymentService.createPaymentIntent(orderId, paymentMethod);
    
    res.status(200).json({
      message: 'Payment intent created successfully',
      paymentIntent
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const { paymentIntentId, paymentMethod } = confirmPaymentSchema.parse(req.body);
    
    const result = await paymentService.confirmPayment(paymentIntentId, paymentMethod);
    
    if (result.success && result.transactionId) {
      // Update order payment status
      // Note: In a real implementation, you would get the order ID from the payment intent
      // For now, we'll need to store this mapping or get it from the request
      
      res.status(200).json({
        message: 'Payment confirmed successfully',
        transactionId: result.transactionId
      });
    } else {
      res.status(400).json({
        message: 'Payment confirmation failed',
        code: 'PAYMENT_FAILED'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      const error = new Error('Unauthorized') as any;
      error.status = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const { transactionId, amount } = refundPaymentSchema.parse(req.body);
    
    const result = await paymentService.refundPayment(transactionId, amount);
    
    if (result.success) {
      res.status(200).json({
        message: 'Refund processed successfully',
        refundId: result.refundId
      });
    } else {
      res.status(400).json({
        message: 'Refund processing failed',
        code: 'REFUND_FAILED'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getPaymentMethods = async (req: Request, res: Response) => {
  // Return available payment methods
  res.status(200).json({
    paymentMethods: [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Pay with credit card via Stripe',
        icon: '💳'
      },
      {
        id: 'iyzico',
        name: 'Iyzico',
        description: 'Pay with credit card via Iyzico',
        icon: '🏦'
      }
    ]
  });
};
