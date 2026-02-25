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
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(cors());
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

// dev routes (optional: only enable in non-prod)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRouter);
}

const start = async () => {
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
