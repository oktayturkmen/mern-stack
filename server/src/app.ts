import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFound } from './middlewares/error';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Stripe webhook endpoint needs raw body, so it must be before express.json()
import { handleStripeWebhook } from './controllers/webhookController';
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

app.get('/health', (_req, res) => {
  res.status(200).json({ message: 'ok' });
});

// API routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import paymentRoutes from './routes/paymentRoutes';
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
