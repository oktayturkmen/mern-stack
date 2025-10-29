import { Request, Response } from 'express';
import Stripe from 'stripe';
import { env } from '../config/env';
import { Order } from '../models/Order';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailure(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      console.error('No orderId found in payment intent metadata');
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    // Update order payment status
    order.payment.status = 'paid';
    order.payment.transactionId = paymentIntent.id;
    await order.save();

    console.log(`Order ${orderId} payment confirmed via webhook`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      console.error('No orderId found in payment intent metadata');
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    // Update order payment status
    order.payment.status = 'failed';
    await order.save();

    console.log(`Order ${orderId} payment failed via webhook`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

