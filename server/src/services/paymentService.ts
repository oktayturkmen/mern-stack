import Stripe from 'stripe';
import { Order } from '../models/Order';
import { env } from '../config/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
}

export interface PaymentService {
  createPaymentIntent(orderId: string, paymentMethod: 'stripe' | 'iyzico'): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string, paymentMethod: 'stripe' | 'iyzico'): Promise<{ success: boolean; transactionId?: string }>;
  refundPayment(transactionId: string, amount?: number): Promise<{ success: boolean; refundId?: string }>;
}

class PaymentServiceImpl implements PaymentService {
  async createPaymentIntent(orderId: string, paymentMethod: 'stripe' | 'iyzico'): Promise<PaymentIntent> {
    if (paymentMethod !== 'stripe') {
      const error = new Error('Only Stripe payments are currently supported') as any;
      error.status = 400;
      error.code = 'UNSUPPORTED_PAYMENT_METHOD';
      throw error;
    }

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Order not found') as any;
      error.status = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    if (order.payment.status !== 'pending') {
      const error = new Error('Order payment is not pending') as any;
      error.status = 400;
      error.code = 'PAYMENT_NOT_PENDING';
      throw error;
    }

    try {
      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: orderId.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret || '',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status as PaymentIntent['status']
      };
    } catch (error: any) {
      console.error('Stripe payment intent creation failed:', error);
      const err = new Error(error.message || 'Failed to create payment intent') as any;
      err.status = 500;
      err.code = 'PAYMENT_INTENT_CREATION_FAILED';
      throw err;
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethod: 'stripe' | 'iyzico'): Promise<{ success: boolean; transactionId?: string }> {
    if (paymentMethod !== 'stripe') {
      const error = new Error('Only Stripe payments are currently supported') as any;
      error.status = 400;
      error.code = 'UNSUPPORTED_PAYMENT_METHOD';
      throw error;
    }

    try {
      // Retrieve the payment intent to check its status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update order payment status
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            'payment.status': 'paid',
            'payment.transactionId': paymentIntent.id
          });
        }
        
        return { success: true, transactionId: paymentIntent.id };
      } else {
        return { success: false };
      }
    } catch (error: any) {
      console.error('Stripe payment confirmation failed:', error);
      const err = new Error(error.message || 'Failed to confirm payment') as any;
      err.status = 500;
      err.code = 'PAYMENT_CONFIRMATION_FAILED';
      throw err;
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<{ success: boolean; refundId?: string }> {
    try {
      // Retrieve the payment intent first
      const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
      
      // Create a refund
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: transactionId,
      };
      
      if (amount) {
        refundParams.amount = Math.round(amount * 100); // Convert to cents
      }
      
      const refund = await stripe.refunds.create(refundParams);
      
      // Update order payment status
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          'payment.status': 'refunded'
        });
      }
      
      return { success: true, refundId: refund.id };
    } catch (error: any) {
      console.error('Stripe refund failed:', error);
      const err = new Error(error.message || 'Failed to process refund') as any;
      err.status = 500;
      err.code = 'REFUND_FAILED';
      throw err;
    }
  }
}

export const paymentService = new PaymentServiceImpl();
