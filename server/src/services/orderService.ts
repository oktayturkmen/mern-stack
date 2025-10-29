import { Order, IOrder } from '../models/Order';
import { Product } from '../models/Product';
import { z } from 'zod';

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'stripe' | 'iyzico' | 'cash';
}

export interface OrderService {
  createOrder(userId: string, data: CreateOrderData): Promise<IOrder>;
  getOrdersByUser(userId: string): Promise<IOrder[]>;
  getAllOrders(): Promise<IOrder[]>;
  getOrderById(orderId: string, userId?: string): Promise<IOrder | null>;
  updateOrderStatus(orderId: string, status: string): Promise<IOrder | null>;
  updatePaymentStatus(orderId: string, paymentStatus: string, transactionId?: string): Promise<IOrder | null>;
}

class OrderServiceImpl implements OrderService {
  async createOrder(userId: string, data: CreateOrderData): Promise<IOrder> {
    // Validate products and calculate total
    const productIds = data.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    if (products.length !== productIds.length) {
      const error = new Error('Some products not found') as any;
      error.status = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    // Calculate total amount and validate stock
    let totalAmount = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) {
        const error = new Error(`Product ${item.productId} not found`) as any;
        error.status = 404;
        error.code = 'PRODUCT_NOT_FOUND';
        throw error;
      }

      if (product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${product.title}`) as any;
        error.status = 400;
        error.code = 'INSUFFICIENT_STOCK';
        throw error;
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: data.shippingAddress,
      payment: {
        method: data.paymentMethod,
        status: 'pending'
      },
      totalAmount
    });

    await order.save();

    // Update product stock
    for (const item of data.items) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    return order.populate('items.product');
  }

  async getOrdersByUser(userId: string): Promise<IOrder[]> {
    return Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getAllOrders(): Promise<IOrder[]> {
    return Order.find()
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getOrderById(orderId: string, userId?: string): Promise<IOrder | null> {
    const query: any = { _id: orderId };
    if (userId) {
      query.user = userId;
    }

    return Order.findOne(query)
      .populate('items.product')
      .populate('user', 'name email')
      .lean();
  }

  async updateOrderStatus(orderId: string, status: string): Promise<IOrder | null> {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product');

    return order;
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string, transactionId?: string): Promise<IOrder | null> {
    const updateData: any = { 'payment.status': paymentStatus };
    if (transactionId) {
      updateData['payment.transactionId'] = transactionId;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.product');

    return order;
  }
}

export const orderService = new OrderServiceImpl();
