import 'dotenv/config';
import { connectDB } from '../config/db';
import { Trade } from '../models/Trade';
import { fetchRecentTrades } from '../services/congressApi';
import { ingestTrades } from '../services/ingestService';
import mongoose from 'mongoose';

const run = async () => {
    await connectDB();
    console.log('Clearing existing trades...');
    await Trade.deleteMany({});
    console.log('Trades cleared.');

    console.log('Fetching live trades from API...');
    const trades = await fetchRecentTrades();
    console.log(`Fetched ${trades.length} trades.`);

    if (trades.length > 0) {
        const { newCount } = await ingestTrades(trades);
        console.log(`Ingested ${newCount} new trades.`);
    }

    await mongoose.disconnect();
};

run().catch(console.error);
