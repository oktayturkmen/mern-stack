import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Order } from '../src/models/Order';
import { Product } from '../src/models/Product';
import { User } from '../src/models/User';

describe('Order API', () => {
  let authCookie: string;
  let adminCookie: string;
  let testProduct: any;
  let testUser: any;

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

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();

    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    adminCookie = adminLoginResponse.headers['set-cookie'][0];

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
  });

  describe('POST /api/orders', () => {
    it('should create order with valid data', async () => {
      const orderData = {
        items: [
          {
            productId: testProduct._id.toString(),
            quantity: 2
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'stripe'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', authCookie)
        .send(orderData)
        .expect(201);

      expect(response.body.message).toBe('Order created successfully');
      expect(response.body.order.totalAmount).toBe(200);
      expect(response.body.order.items).toHaveLength(1);
      expect(response.body.order.status).toBe('pending');
      expect(response.body.order.payment.status).toBe('pending');
    });

    it('should not create order without authentication', async () => {
      const orderData = {
        items: [{ productId: testProduct._id.toString(), quantity: 1 }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'stripe'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should not create order with insufficient stock', async () => {
      const orderData = {
        items: [
          {
            productId: testProduct._id.toString(),
            quantity: 15 // More than available stock (10)
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'stripe'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', authCookie)
        .send(orderData)
        .expect(400);

      expect(response.body.code).toBe('INSUFFICIENT_STOCK');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', authCookie)
        .send({ items: [] })
        .expect(400);

      expect(response.body.message).toContain('items');
    });
  });

  describe('GET /api/orders/my', () => {
    beforeEach(async () => {
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
    });

    it('should get user orders', async () => {
      const response = await request(app)
        .get('/api/orders/my')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.orders).toHaveLength(1);
      expect(response.body.orders[0].totalAmount).toBe(200);
    });

    it('should not get orders without authentication', async () => {
      const response = await request(app)
        .get('/api/orders/my')
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/orders/:id', () => {
    let testOrder: any;

    beforeEach(async () => {
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

    it('should get order by id', async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.order._id).toBe(testOrder._id.toString());
      expect(response.body.order.totalAmount).toBe(200);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/507f1f77bcf86cd799439011')
        .set('Cookie', authCookie)
        .expect(404);

      expect(response.body.code).toBe('ORDER_NOT_FOUND');
    });
  });

  describe('PUT /api/orders/:id/status (Admin)', () => {
    let testOrder: any;

    beforeEach(async () => {
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

    it('should update order status as admin', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set('Cookie', adminCookie)
        .send({ status: 'processing' })
        .expect(200);

      expect(response.body.message).toBe('Order status updated successfully');
      expect(response.body.order.status).toBe('processing');
    });

    it('should not update order status without admin role', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set('Cookie', authCookie)
        .send({ status: 'processing' })
        .expect(403);

      expect(response.body.code).toBe('ADMIN_REQUIRED');
    });

    it('should validate status values', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set('Cookie', adminCookie)
        .send({ status: 'invalid_status' })
        .expect(400);

      expect(response.body.message).toContain('Invalid status');
    });
  });
});
