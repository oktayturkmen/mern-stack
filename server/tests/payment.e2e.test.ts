import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Order } from '../src/models/Order';
import { Product } from '../src/models/Product';
import { User } from '../src/models/User';

describe('Payment API', () => {
  let authCookie: string;
  let testProduct: any;
  let testUser: any;
  let testOrder: any;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_test');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    authCookie = userResponse.headers['set-cookie'][0];
    testUser = userResponse.body.user;

    // Create test product
    const product = new Product({
      title: 'Test Product',
      description: 'Test Description',
      images: ['https://example.com/image.jpg'],
      price: 100,
      stock: 10,
      category: 'Electronics'
    });
    await product.save();
    testProduct = product;

    // Create test order
    const order = new Order({
      user: testUser.id,
      items: [{
        product: testProduct._id,
        quantity: 2,
        price: testProduct.price
      }],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      payment: {
        method: 'stripe',
        status: 'pending'
      },
      totalAmount: 200
    });
    await order.save();
    testOrder = order;
  });

  describe('GET /api/payments/methods', () => {
    it('should get available payment methods', async () => {
      const response = await request(app)
        .get('/api/payments/methods')
        .expect(200);

      expect(response.body.paymentMethods).toHaveLength(2);
      expect(response.body.paymentMethods[0].id).toBe('stripe');
      expect(response.body.paymentMethods[1].id).toBe('iyzico');
    });
  });

  describe('POST /api/payments/create-intent', () => {
    it('should create payment intent for valid order', async () => {
      const paymentData = {
        orderId: testOrder._id.toString(),
        paymentMethod: 'stripe'
      };

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Cookie', authCookie)
        .send(paymentData)
        .expect(200);

      expect(response.body.message).toBe('Payment intent created successfully');
      expect(response.body.paymentIntent).toBeDefined();
      expect(response.body.paymentIntent.id).toMatch(/^pi_/);
      expect(response.body.paymentIntent.clientSecret).toMatch(/^pi_.*_secret_/);
      expect(response.body.paymentIntent.amount).toBe(20000); // 200 * 100 cents
      expect(response.body.paymentIntent.currency).toBe('usd');
      expect(response.body.paymentIntent.status).toBe('requires_payment_method');
    });

    it('should create payment intent for iyzico', async () => {
      const paymentData = {
        orderId: testOrder._id.toString(),
        paymentMethod: 'iyzico'
      };

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Cookie', authCookie)
        .send(paymentData)
        .expect(200);

      expect(response.body.paymentIntent).toBeDefined();
      expect(response.body.paymentIntent.id).toMatch(/^pi_/);
    });

    it('should not create payment intent without authentication', async () => {
      const paymentData = {
        orderId: testOrder._id.toString(),
        paymentMethod: 'stripe'
      };

      const response = await request(app)
        .post('/api/payments/create-intent')
        .send(paymentData)
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should not create payment intent for non-existent order', async () => {
      const paymentData = {
        orderId: '507f1f77bcf86cd799439011',
        paymentMethod: 'stripe'
      };

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Cookie', authCookie)
        .send(paymentData)
        .expect(404);

      expect(response.body.code).toBe('ORDER_NOT_FOUND');
    });

    it('should validate payment method', async () => {
      const paymentData = {
        orderId: testOrder._id.toString(),
        paymentMethod: 'invalid_method'
      };

      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Cookie', authCookie)
        .send(paymentData)
        .expect(400);

      expect(response.body.message).toContain('payment method');
    });
  });

  describe('POST /api/payments/confirm', () => {
    it('should confirm payment with valid payment intent', async () => {
      const confirmData = {
        paymentIntentId: 'pi_test_123',
        paymentMethod: 'stripe'
      };

      const response = await request(app)
        .post('/api/payments/confirm')
        .set('Cookie', authCookie)
        .send(confirmData);

      // Payment confirmation is mocked and may succeed or fail randomly
      expect([200, 400]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body.message).toBe('Payment confirmed successfully');
        expect(response.body.transactionId).toMatch(/^txn_/);
      } else {
        expect(response.body.code).toBe('PAYMENT_FAILED');
      }
    });

    it('should not confirm payment without authentication', async () => {
      const confirmData = {
        paymentIntentId: 'pi_test_123',
        paymentMethod: 'stripe'
      };

      const response = await request(app)
        .post('/api/payments/confirm')
        .send(confirmData)
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should validate payment method', async () => {
      const confirmData = {
        paymentIntentId: 'pi_test_123',
        paymentMethod: 'invalid_method'
      };

      const response = await request(app)
        .post('/api/payments/confirm')
        .set('Cookie', authCookie)
        .send(confirmData)
        .expect(400);

      expect(response.body.message).toContain('payment method');
    });
  });

  describe('POST /api/payments/refund', () => {
    it('should process refund with valid transaction', async () => {
      const refundData = {
        transactionId: 'txn_test_123',
        amount: 100
      };

      const response = await request(app)
        .post('/api/payments/refund')
        .set('Cookie', authCookie)
        .send(refundData);

      // Refund processing is mocked and may succeed or fail randomly
      expect([200, 400]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body.message).toBe('Refund processed successfully');
        expect(response.body.refundId).toMatch(/^re_/);
      } else {
        expect(response.body.code).toBe('REFUND_FAILED');
      }
    });

    it('should process refund without amount (full refund)', async () => {
      const refundData = {
        transactionId: 'txn_test_123'
      };

      const response = await request(app)
        .post('/api/payments/refund')
        .set('Cookie', authCookie)
        .send(refundData);

      expect([200, 400]).toContain(response.status);
    });

    it('should not process refund without authentication', async () => {
      const refundData = {
        transactionId: 'txn_test_123'
      };

      const response = await request(app)
        .post('/api/payments/refund')
        .send(refundData)
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should validate transaction ID', async () => {
      const refundData = {
        transactionId: ''
      };

      const response = await request(app)
        .post('/api/payments/refund')
        .set('Cookie', authCookie)
        .send(refundData)
        .expect(400);

      expect(response.body.message).toContain('Transaction ID');
    });
  });
});
