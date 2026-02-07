
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import YahooFinance from 'yahoo-finance2';
import { Trade } from '../models/Trade';
import { Politician } from '../models/Politician';

dotenv.config();

const yahooFinance = new YahooFinance();

const CURRENT_YEAR = new Date().getFullYear();
const LAST_YEAR = CURRENT_YEAR - 1; // 2025
const START_DATE = new Date(`${LAST_YEAR}-01-01`);
const DELAY_MS = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getPriceOnDate = async (ticker: string, date: Date): Promise<number | null> => {
    try {
        const queryOptions = {
            period1: date,
            period2: new Date(date.getTime() + 86400000 * 3), // +3 days to account for weekends/holidays
            interval: '1d' as const,
        };
        const result = await yahooFinance.historical(ticker, queryOptions) as any[];
        if (result && result.length > 0) {
            return result[0].close;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching historical price for ${ticker} on ${date}:`, error);
        return null; // Handle error gracefully (e.g. invalid ticker)
    }
};

const getCurrentPrice = async (ticker: string): Promise<number | null> => {
    try {
        const quote = await yahooFinance.quote(ticker) as any;
        return quote.regularMarketPrice || null;
    } catch (error) {
        console.error(`Error fetching current price for ${ticker}:`, error);
        return null;
    }
};

const updateLeaderboard = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to DB');

        const politicians = await Politician.find({});
        console.log(`Found ${politicians.length} politicians.`);

        for (const politician of politicians) {
            console.log(`Processing ${politician.name}...`);

            // Find BUY trades since start of last year
            const trades = await Trade.find({
                politicianId: politician._id,
                transactionType: 'Buy',
                transactionDate: { $gte: START_DATE }
            });

            if (trades.length === 0) {
                console.log(`  No BUY trades since ${START_DATE.toISOString().split('T')[0]}. Skipping.`);
                continue;
            }

            let totalReturn = 0;
            let validTradesCount = 0;
            const holdingCounts: Record<string, number> = {};

            for (const trade of trades) {
                // Skip if ticker contains anything other than letters (e.g. BRK.B -> BRK-B needed for Yahoo?)
                // Actually yahoo-finance2 might handle dot, but let's be safe.
                // Usually Yahoo uses '-' instead of '.' for classes.
                // But let's just try as is first, or replace '.' with '-'.
                let ticker = trade.ticker;
                if (ticker.includes('.')) {
                    ticker = ticker.replace('.', '-');
                }

                const purchasePrice = await getPriceOnDate(ticker, trade.transactionDate!);
                if (!purchasePrice) {
                    console.log(`  Could not get purchase price for ${ticker}. Skipping.`);
                    await delay(DELAY_MS);
                    continue;
                }

                const currentPrice = await getCurrentPrice(ticker);
                if (!currentPrice) {
                    console.log(`  Could not get current price for ${ticker}. Skipping.`);
                    await delay(DELAY_MS);
                    continue;
                }

                const returnPct = ((currentPrice - purchasePrice) / purchasePrice) * 100;
                totalReturn += returnPct;
                validTradesCount++;

                holdingCounts[ticker] = (holdingCounts[ticker] || 0) + 1;

                // Rate limit to be nice to Yahoo
                await delay(DELAY_MS);
            }

            if (validTradesCount > 0) {
                const avgReturn = totalReturn / validTradesCount;

                // Find top holding
                let topHolding = '';
                let maxCount = 0;
                for (const [ticker, count] of Object.entries(holdingCounts)) {
                    if (count > maxCount) {
                        maxCount = count;
                        topHolding = ticker;
                    }
                }

                // Update Politician
                politician.stats = {
                    ytdReturn: parseFloat(avgReturn.toFixed(2)),
                    topHolding: topHolding,
                    lastUpdated: new Date()
                };
                await politician.save();
                console.log(`  Updated stats for ${politician.name}: YTD ${avgReturn.toFixed(2)}%, Top: ${topHolding}`);
            } else {
                console.log(`  No valid price data found for any trades.`);
            }
        }

        console.log('Leaderboard update complete.');
        process.exit(0);

    } catch (err) {
        console.error('Error updating leaderboard:', err);
        process.exit(1);
    }
};

updateLeaderboard();
