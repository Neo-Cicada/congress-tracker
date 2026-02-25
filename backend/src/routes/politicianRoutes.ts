
import express from 'express';
import YahooFinance from 'yahoo-finance2';
import { Politician } from '../models/Politician';
import { Trade } from '../models/Trade';

const router = express.Router();
// Use singleton approach or instantiate with options if needed, 
// strictly YahooFinance default import used here per previous fix.
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// Cache for SPY YTD return
let cachedSpyYtd: number | null = null;
let lastSpyUpdate: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const getSpyYtdReturn = async (): Promise<number> => {
    const currentYear = new Date().getFullYear();
    const now = Date.now();

    // Check cache
    if (cachedSpyYtd !== null && (now - lastSpyUpdate) < CACHE_DURATION) {
        return cachedSpyYtd;
    }

    try {
        // Fetch historical data for YTD calculation
        const startOfYear = new Date(`${currentYear}-01-01`);
        const queryOptions = {
            period1: startOfYear,
            period2: new Date(), // Today
            interval: '1d' as const
        };
        const history = await yahooFinance.historical('SPY', queryOptions) as any[];

        if (history && history.length > 0) {
            const startPrice = history[0].close;
            const quote = await yahooFinance.quote('SPY') as any;
            const currentPrice = quote.regularMarketPrice;

            const ytd = ((currentPrice - startPrice) / startPrice) * 100;

            cachedSpyYtd = parseFloat(ytd.toFixed(2));
            lastSpyUpdate = now;
            return cachedSpyYtd;
        }
    } catch (error) {
        console.error('Error fetching SPY YTD:', error);
    }

    return cachedSpyYtd || 0; // Return last known or 0
};

// GET /api/politician - Search politicians
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { name: { $regex: String(search), $options: 'i' } };
        }
        const politicians = await Politician.find(query).limit(20);
        res.json(politicians);
    } catch (error) {
        console.error('Error fetching politicians list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/politician/:id - Get politician details and analysis
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const politician = await Politician.findById(id);

        if (!politician) {
            res.status(404).json({ message: 'Politician not found' });
            return;
        }

        const trades = await Trade.find({ politicianId: id })
            .sort({ transactionDate: -1 })
            .limit(50);

        const spyYtd = await getSpyYtdReturn();

        // Simple Alpha Strategy Analysis
        const tickerCounts: Record<string, number> = {};
        let totalBuy = 0;
        let totalSell = 0;

        trades.forEach(t => {
            tickerCounts[t.ticker] = (tickerCounts[t.ticker] || 0) + 1;
            if (t.transactionType === 'Buy') totalBuy++;
            if (t.transactionType === 'Sell') totalSell++;
        });

        // Top 3 tickers
        const topTickers = Object.entries(tickerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([ticker]) => ticker);

        let strategySummary = `Primarily trades ${topTickers.join(', ')}. `;
        if (totalBuy > totalSell * 1.5) {
            strategySummary += "Shows a strong accumulation pattern (Net Buyer).";
        } else if (totalSell > totalBuy * 1.5) {
            strategySummary += "Shows a distribution pattern (Net Seller).";
        } else {
            strategySummary += "Maintains a balanced trading activity.";
        }

        res.json({
            politician,
            trades,
            comparison: {
                spyYtd,
                politicianYtd: politician.stats?.ytdReturn || 0
            },
            analysis: {
                strategy: strategySummary,
                topTickers
            }
        });

    } catch (error) {
        console.error('Error fetching politician details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
