import { Router, Request, Response } from 'express';
import { Trade } from '../models/Trade';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { ticker, politician, type, chamber, limit = '50', skip = '0' } = req.query;

    const query: any = {};

    if (ticker && typeof ticker === 'string') {
      query.ticker = ticker.toUpperCase();
    }

    if (politician && typeof politician === 'string') {
      query.politicianName = { $regex: new RegExp(politician, 'i') };
    }

    if (type && typeof type === 'string') {
      query.transactionType = type;
    }

    if (chamber && typeof chamber === 'string') {
      query.chamber = chamber;
    }

    const parsedLimit = Math.min(parseInt(limit as string, 10) || 50, 200);
    const parsedSkip = parseInt(skip as string, 10) || 0;

    const trades = await Trade.find(query)
      .sort({ transactionDate: -1, createdAt: -1 })
      .skip(parsedSkip)
      .limit(parsedLimit)
      .lean()
      .exec();

    res.json({ trades });
  } catch (err: any) {
    console.error('Error fetching trades:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
