# Mern Ecommerce Architecture

MERN E-Commerce Architecture Plan
1. Monorepo / Project Structure
ecommerce/
├─ package.json
├─ .editorconfig  .gitignore  README.md
├─ .env.example
├─ client/
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ store.ts
│  │  │  └─ routes.tsx
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ features/
│  │  ├─ services/
│  │  ├─ hooks/
│  │  ├─ utils/
│  │  ├─ assets/
│  │  └─ styles/
│  └─ vite.config.ts tsconfig.json
├─ server/
│  ├─ src/
│  │  ├─ app.ts  server.ts
│  │  ├─ config/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ controllers/
│  │  ├─ services/
│  │  ├─ middlewares/
│  │  ├─ libs/
│  │  ├─ utils/
│  │  └─ types/
│  └─ tsconfig.json
├─ scripts/
│  └─ seed.ts
└─ docker/
2. Environment Variables
server/.env
1

NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=supersecret_change_me
CLIENT_URL=http://localhost:5173
PAYMENT_PROVIDER=stripe
client/.env
VITE_API_URL=http://localhost:5000/api
3. Data Models (MongoDB + Mongoose)
User
name, email, password, role (user/admin)
addresses: multiple with defaults
Product
title, slug, description, images
price, stock, category, ratingAvg, ratingCount
Order
user , items[], shippingAddress, payment, status
Review
user , product, rating, comment
4. REST API Endpoints
Resource Method Path Description Auth
Auth POST /auth/register Register user No
POST /auth/login Login No
GET /auth/me Current user Yes
Product GET /products List with filters No
GET /products/:slug Details No
POST /products Create (admin) Admin
PUT /products/:id Update Admin• 
• 
• 
• 
• 
• 
2

Resource Method Path Description Auth
DELETE /products/:id Delete Admin
Order POST /orders Create order Yes
GET /orders/my My orders Yes
GET /orders/:id Get one Yes
PUT /orders/:id/status Update status Admin
Payment POST /payments/create-intent Payment intent Yes
5. Client-Server Communication
Server starts, connects to MongoDB.
CORS: only CLIENT_URL allowed.
Auth: JWT via httpOnly cookie.
Client: axios with withCredentials:true .
Payment: handled via Stripe/Iyzico SDK.
6. Middleware
auth.ts : verify user/admin
errorHandler.ts : global error responses
rateLimit.ts : throttle sensitive routes
validate.ts : zod schema validation
notFound.ts : handle 404s
7. Security
JWT (httpOnly cookies)
bcrypt password hashing
CORS whitelist
Rate limiting
Input validation
Role-based authorization
MongoDB indexes for search
8. Testing
Server: Jest + Supertest
Client: React Testing Library
Postman collections for API testing1. 
2. 
3. 
4. 
5. 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
3

9. Deployment
Backend: Node (Docker/PM2), Mongo Atlas
Frontend: Static hosting (Nginx/S3/CloudFront)
CI/CD: GitHub Actions
10. Development Sprints
Sprint 1:  Auth + base setup  Sprint 2:  Products + cart  Sprint 3:  Checkout + orders  Sprint 4:  Admin
dashboard Sprint 5:  Security + testing + optimization• 
• 
• 
4