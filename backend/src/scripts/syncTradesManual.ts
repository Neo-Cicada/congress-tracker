import 'dotenv/config';
import { connectDB } from '../config/db';
import { fetchRecentTrades } from '../services/congressApi';
import { ingestTrades } from '../services/ingestService';
import mongoose from 'mongoose';

const run = async () => {
    await connectDB();
    console.log('Fetching live trades from API...');

    try {
        const trades = await fetchRecentTrades();
        console.log(`Fetched ${trades.length} trades.`);

        if (trades.length > 0) {
            const { newCount } = await ingestTrades(trades);
            console.log(`Ingested ${newCount} new trades.`);
        } else {
            console.log('No new trades found.');
        }
    } catch (err) {
        console.error('Error fetching/ingesting trades:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from DB.');
    }
};

run().catch(console.error);
