import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Product } from '../src/models/Product';
import { Order } from '../src/models/Order';
import { User } from '../src/models/User';

describe('Admin API', () => {
  let adminCookie: string;
  let userCookie: string;
  let testProduct: any;
  let testOrder: any;
  let adminUser: any;
  let regularUser: any;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_test');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminUserResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123'
      });
    adminUser = adminUserResponse.body.user;
    
    // Make user admin
    await User.findByIdAndUpdate(adminUser.id, { role: 'admin' });
    
    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    adminCookie = adminLoginResponse.headers['set-cookie'][0];

    // Create regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123'
      });
    regularUser = userResponse.body.user;
    userCookie = userResponse.headers['set-cookie'][0];

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
      user: regularUser.id,
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

  describe('Admin Product Management', () => {
    describe('POST /api/products (Admin)', () => {
      it('should create product as admin', async () => {
        const productData = {
          title: 'New Product',
          description: 'New Description',
          images: ['https://example.com/new-image.jpg'],
          price: 150,
          stock: 5,
          category: 'Clothing'
        };

        const response = await request(app)
          .post('/api/products')
          .set('Cookie', adminCookie)
          .send(productData)
          .expect(201);

        expect(response.body.message).toBe('Product created successfully');
        expect(response.body.product.title).toBe('New Product');
        expect(response.body.product.price).toBe(150);
      });

      it('should not create product without admin role', async () => {
        const productData = {
          title: 'New Product',
          description: 'New Description',
          price: 150,
          stock: 5,
          category: 'Clothing'
        };

        const response = await request(app)
          .post('/api/products')
          .set('Cookie', userCookie)
          .send(productData)
          .expect(403);

        expect(response.body.code).toBe('ADMIN_REQUIRED');
      });

      it('should validate required fields', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Cookie', adminCookie)
          .send({ title: 'Incomplete Product' })
          .expect(400);

        expect(response.body.message).toContain('required');
      });
    });

    describe('PUT /api/products/:id (Admin)', () => {
      it('should update product as admin', async () => {
        const updateData = {
          title: 'Updated Product',
          price: 200,
          stock: 15
        };

        const response = await request(app)
          .put(`/api/products/${testProduct._id}`)
          .set('Cookie', adminCookie)
          .send(updateData)
          .expect(200);

        expect(response.body.message).toBe('Product updated successfully');
        expect(response.body.product.title).toBe('Updated Product');
        expect(response.body.product.price).toBe(200);
      });

      it('should not update product without admin role', async () => {
        const response = await request(app)
          .put(`/api/products/${testProduct._id}`)
          .set('Cookie', userCookie)
          .send({ title: 'Unauthorized Update' })
          .expect(403);

        expect(response.body.code).toBe('ADMIN_REQUIRED');
      });
    });

    describe('DELETE /api/products/:id (Admin)', () => {
      it('should delete product as admin', async () => {
        const response = await request(app)
          .delete(`/api/products/${testProduct._id}`)
          .set('Cookie', adminCookie)
          .expect(200);

        expect(response.body.message).toBe('Product deleted successfully');

        // Verify product is deleted
        const deletedProduct = await Product.findById(testProduct._id);
        expect(deletedProduct).toBeNull();
      });

      it('should not delete product without admin role', async () => {
        const response = await request(app)
          .delete(`/api/products/${testProduct._id}`)
          .set('Cookie', userCookie)
          .expect(403);

        expect(response.body.code).toBe('ADMIN_REQUIRED');
      });
    });
  });

  describe('Admin Order Management', () => {
    describe('PUT /api/orders/:id/status (Admin)', () => {
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
          .set('Cookie', userCookie)
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

      it('should return 404 for non-existent order', async () => {
        const response = await request(app)
          .put('/api/orders/507f1f77bcf86cd799439011/status')
          .set('Cookie', adminCookie)
          .send({ status: 'processing' })
          .expect(404);

        expect(response.body.code).toBe('ORDER_NOT_FOUND');
      });
    });
  });

  describe('Admin Access Control', () => {
    it('should allow admin to access all endpoints', async () => {
      // Test admin can access product creation
      const productResponse = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookie)
        .send({
          title: 'Admin Product',
          description: 'Admin Description',
          price: 100,
          stock: 10,
          category: 'Test'
        })
        .expect(201);

      expect(productResponse.body.product).toBeDefined();

      // Test admin can update order status
      const orderResponse = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set('Cookie', adminCookie)
        .send({ status: 'shipped' })
        .expect(200);

      expect(orderResponse.body.order.status).toBe('shipped');
    });

    it('should deny regular user access to admin endpoints', async () => {
      // Test regular user cannot create products
      const productResponse = await request(app)
        .post('/api/products')
        .set('Cookie', userCookie)
        .send({
          title: 'User Product',
          description: 'User Description',
          price: 100,
          stock: 10,
          category: 'Test'
        })
        .expect(403);

      expect(productResponse.body.code).toBe('ADMIN_REQUIRED');

      // Test regular user cannot update order status
      const orderResponse = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set('Cookie', userCookie)
        .send({ status: 'shipped' })
        .expect(403);

      expect(orderResponse.body.code).toBe('ADMIN_REQUIRED');
    });
  });
});
