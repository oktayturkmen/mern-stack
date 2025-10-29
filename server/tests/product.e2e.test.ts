import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Product } from '../src/models/Product';
import { User } from '../src/models/User';

describe('Product API', () => {
  let authCookie: string;
  let adminCookie: string;
  let testProduct: any;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_test');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Product.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
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
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Create test products
      const products = [
        {
          title: 'Test Product 1',
          description: 'Description 1',
          images: ['https://example.com/image1.jpg'],
          price: 100,
          stock: 10,
          category: 'Electronics'
        },
        {
          title: 'Test Product 2',
          description: 'Description 2',
          images: ['https://example.com/image2.jpg'],
          price: 200,
          stock: 5,
          category: 'Clothing'
        }
      ];

      for (const productData of products) {
        const product = new Product(productData);
        await product.save();
      }
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(response.body.pagination.totalProducts).toBe(2);
      expect(response.body.pagination.currentPage).toBe(1);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Electronics')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].category).toBe('Electronics');
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=150&maxPrice=250')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].price).toBe(200);
    });

    it('should search products by text', async () => {
      const response = await request(app)
        .get('/api/products?search=Test Product 1')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].title).toBe('Test Product 1');
    });

    it('should sort products by price', async () => {
      const response = await request(app)
        .get('/api/products?sortBy=price&sortOrder=asc')
        .expect(200);

      expect(response.body.products[0].price).toBe(100);
      expect(response.body.products[1].price).toBe(200);
    });

    it('should paginate products', async () => {
      const response = await request(app)
        .get('/api/products?limit=1&page=1')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.pagination.totalPages).toBe(2);
    });
  });

  describe('GET /api/products/:slug', () => {
    beforeEach(async () => {
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

    it('should get product by slug', async () => {
      const response = await request(app)
        .get(`/api/products/${testProduct.slug}`)
        .expect(200);

      expect(response.body.product.title).toBe('Test Product');
      expect(response.body.product.slug).toBe(testProduct.slug);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/non-existent-slug')
        .expect(404);

      expect(response.body.code).toBe('PRODUCT_NOT_FOUND');
    });
  });

  describe('POST /api/products (Admin)', () => {
    it('should create product as admin', async () => {
      const productData = {
        title: 'New Product',
        description: 'New Description',
        images: ['https://example.com/image.jpg'],
        price: 150,
        stock: 20,
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookie)
        .send(productData)
        .expect(201);

      expect(response.body.message).toBe('Product created successfully');
      expect(response.body.product.title).toBe('New Product');
    });

    it('should not create product without admin role', async () => {
      const productData = {
        title: 'New Product',
        description: 'New Description',
        images: ['https://example.com/image.jpg'],
        price: 150,
        stock: 20,
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Cookie', authCookie)
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

      expect(response.body.message).toContain('description');
    });
  });

  describe('PUT /api/products/:id (Admin)', () => {
    beforeEach(async () => {
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

    it('should update product as admin', async () => {
      const updateData = {
        title: 'Updated Product',
        price: 200
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

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/507f1f77bcf86cd799439011')
        .set('Cookie', adminCookie)
        .send({ title: 'Updated Product' })
        .expect(404);

      expect(response.body.code).toBe('PRODUCT_NOT_FOUND');
    });
  });

  describe('DELETE /api/products/:id (Admin)', () => {
    beforeEach(async () => {
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

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .delete('/api/products/507f1f77bcf86cd799439011')
        .set('Cookie', adminCookie)
        .expect(404);

      expect(response.body.code).toBe('PRODUCT_NOT_FOUND');
    });
  });
});
