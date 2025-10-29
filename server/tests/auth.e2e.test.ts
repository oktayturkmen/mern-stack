import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { User } from '../src/models/User';

describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_test');
  });

  afterAll(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.password).toBeUndefined();
      
      // Check if cookie is set
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should not register duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      // First registration
      await request(app).post('/api/auth/register').send(userData);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.code).toBe('USER_EXISTS');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test' })
        .expect(400);

      expect(response.body.message).toContain('email');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.password).toBeUndefined();
      
      // Check if cookie is set
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('GET /api/auth/me', () => {
    let authCookie: string;

    beforeEach(async () => {
      // Register and get auth cookie
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      authCookie = response.headers['set-cookie'][0];
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.password).toBeUndefined();
    });

    it('should not get user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.code).toBe('NO_TOKEN');
    });
  });
});
