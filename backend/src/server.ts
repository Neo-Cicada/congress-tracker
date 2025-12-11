import 'dotenv/config';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { connectDB } from './config/db';
import tradesRouter from './routes/trades';
import { setupTradeSyncCron } from './cron/syncTrades';

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// routes
app.use('/api/trades', tradesRouter);

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
