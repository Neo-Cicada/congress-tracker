import { Router, Request, Response } from 'express';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
import { Trade } from '../models/Trade';

const router = Router();

/**
 * GET /api/trades/popular
 * Returns the most popular stocks traded by members of Congress in the last 30 days.
 */
router.get('/popular', async (req: Request, res: Response): Promise<void> => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const pipeline = [
      {
        $match: {
          transactionDate: { $gte: ninetyDaysAgo },
          ticker: { $exists: true, $ne: null, $nin: ['', 'N/A'] }
        }
      },
      {
        $group: {
          _id: '$ticker',
          name: { $first: '$assetName' },
          uniqueMembers: { $addToSet: '$politicianName' },
          totalTrades: { $sum: 1 },
          buyCount: {
            $sum: { $cond: [{ $eq: ['$transactionType', 'Buy'] }, 1, 0] }
          },
          sellCount: {
            $sum: { $cond: [{ $eq: ['$transactionType', 'Sell'] }, 1, 0] }
          }
        }
      },
      { $project: { ticker: '$_id', name: { $ifNull: ['$name', '$_id'] }, count: { $size: '$uniqueMembers' }, sentiment: { $cond: [{ $gte: ['$buyCount', '$sellCount'] }, 'Bullish', 'Bearish'] } } },
      { $match: { count: { $gte: 1 } } },
      { $sort: { count: -1 as const, ticker: 1 as const } },
      { $limit: 10 }
    ];

    const popularStocks = await Trade.aggregate(pipeline as any[]);

    // Fetch live market changes for these top tickers sequentially to avoid rate-limiting
    const enhancedStocks = [];
    for (const stock of popularStocks) {
      let changeStr = '+0%';
      try {
        const quote = await yahooFinance.quote(stock.ticker) as any;
        const changePercent = quote?.regularMarketChangePercent || 0;
        const sign = changePercent > 0 ? '+' : '';
        changeStr = `${sign}${changePercent.toFixed(2)}%`;
      } catch (err: any) {
        // Fallback if quote fails
        console.error(`Failed to fetch quote for ${stock.ticker}:`, err.message);
        // Return N/A if API fails or rate limited
        changeStr = 'N/A';
      }

      enhancedStocks.push({
        ticker: stock.ticker as string,
        name: stock.name as string,
        count: Number(stock.count),
        sentiment: stock.sentiment as string,
        change: changeStr
      });
    }

    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // Cache for 1 hour
    res.json(enhancedStocks);
  } catch (err: any) {
    console.error('Error fetching popular stocks:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
      search,
      limit = '50',
      skip = '0'
    } = req.query;

    const query: any = {};

    // Generic Search Logic
    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search, 'i');
      const orConditions: any[] = [
        { politicianName: { $regex: searchRegex } },
        { ticker: { $regex: searchRegex } }
      ];

      // Handle full party names in search
      const lowerSearch = search.toLowerCase();
      if ('democrat'.includes(lowerSearch)) orConditions.push({ party: 'D' });
      if ('republican'.includes(lowerSearch)) orConditions.push({ party: 'R' });

      // Also allow direct party match if shorter (e.g. search "D")
      if (['d', 'r'].includes(lowerSearch)) {
        orConditions.push({ party: search.toUpperCase() });
      }

      query.$or = orConditions;
    }

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

    res.set('Cache-Control', 'public, max-age=300, s-maxage=300'); // Cache for 5 minutes
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
