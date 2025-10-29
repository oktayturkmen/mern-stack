import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    method: 'stripe' | 'iyzico' | 'cash';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const shippingAddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const paymentSchema = new Schema({
  method: { type: String, enum: ['stripe', 'iyzico', 'cash'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  transactionId: { type: String }
});

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  payment: paymentSchema,
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, required: true, min: 0 }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
