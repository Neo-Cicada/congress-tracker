import { Router, Request, Response } from 'express';
import { Trade } from '../models/Trade';

const router = Router();

/**
 * GET /api/trades
 * Query:
 *  - ticker=NVDA
 *  - politician=Pelosi
 *  - type=Buy|Sell|Unknown
 *  - chamber=House|Senate
 *  - from=YYYY-MM-DD
 *  - to=YYYY-MM-DD
 *  - limit=50 (max 200)
 *  - skip=0
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      ticker,
      politician,
      type,
      chamber,
      from,
      to,
      limit = '50',
      skip = '0'
    } = req.query;

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

    if ((from && typeof from === 'string') || (to && typeof to === 'string')) {
      query.transactionDate = {};
      if (from && typeof from === 'string') query.transactionDate.$gte = new Date(from);
      if (to && typeof to === 'string') query.transactionDate.$lte = new Date(to);
    }

    const parsedLimit = Math.min(parseInt(limit as string, 10) || 50, 200);
    const parsedSkip = parseInt(skip as string, 10) || 0;

    const [items, total] = await Promise.all([
      Trade.find(query)
        .sort({ transactionDate: -1, createdAt: -1 })
        .skip(parsedSkip)
        .limit(parsedLimit)
        .lean()
        .exec(),
      Trade.countDocuments(query)
    ]);

    res.json({
      trades: items,
      page: {
        limit: parsedLimit,
        skip: parsedSkip,
        total
      }
    });
  } catch (err: any) {
    console.error('Error fetching trades:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
