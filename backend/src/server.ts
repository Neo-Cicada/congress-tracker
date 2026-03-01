import 'dotenv/config';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import tradesRouter from './routes/trades';
import { setupTradeSyncCron } from './cron/syncTrades';
import devRouter from './routes/dev';
import leaderboardRoutes from './routes/leaderboardRoutes';
import politicianRoutes from './routes/politicianRoutes';
import ethicsRoutes from './routes/ethicsRoutes';
import authRoutes from './routes/authRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import userRoutes from './routes/userRoutes';
import { validateEnv } from './config/env';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-to-server, curl)
    if (!origin) return callback(null, true);
    // Check exact match or *.vercel.app pattern for preview deployments
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
// Capture raw body for webhook signature verification
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }), (req: any, _res, next) => {
  req.rawBody = req.body;
  // Parse the raw body into JSON for the controller
  if (Buffer.isBuffer(req.body)) {
    req.body = JSON.parse(req.body.toString());
  }
  next();
});

app.use(express.json());
app.use(morgan('dev'));

// rate limiter (put BEFORE routes)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// routes
app.use('/api/trades', tradesRouter);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/politician', politicianRoutes);
app.use('/api/ethics', ethicsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);

// dev routes (optional: only enable in non-prod)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRouter);
}

// Global Error Handler
app.use(errorHandler);

const start = async () => {
  validateEnv();
  await connectDB();
  setupTradeSyncCron();

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
