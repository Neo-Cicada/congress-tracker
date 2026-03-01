import mongoose from 'mongoose';
import dotenv from 'dotenv';
import YahooFinance from 'yahoo-finance2';
import { Trade } from './src/models/Trade';

dotenv.config();

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('DB connected');

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
                    name: { $first: '$assetName' }
                }
            },
            { $limit: 10 }
        ];

        const popularStocks = await Trade.aggregate(pipeline as any[]);
        console.log('Popular stocks:', popularStocks.map(s => s._id));

        const results = await Promise.all(
            popularStocks.map(async (stock) => {
                try {
                    const quote = await yahooFinance.quote(stock._id) as any;
                    console.log(`[SUCCESS] ${stock._id}: ${quote?.regularMarketChangePercent}`);
                    return true;
                } catch (err: any) {
                    console.error(`[ERROR] ${stock._id}:`, err.message);
                    return false;
                }
            })
        );

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        mongoose.disconnect();
    }
}

main();
