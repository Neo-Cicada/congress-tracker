import 'dotenv/config';
import { connectDB } from './src/config/db';
import { Trade } from './src/models/Trade';
import mongoose from 'mongoose';

const run = async () => {
    await connectDB();
    console.log('Testing sorted trades endpoint logic directly on DB...');

    try {
        const items = await Trade.find({})
            .sort({ filedDate: -1, transactionDate: -1 })
            .limit(5)
            .lean()
            .exec();
        
        console.log("Top 5 Results by filedDate:");
        items.forEach(i => {
            console.log(`- ${i.politicianName} (${i.ticker}): Filed ${i.filedDate}, Tx ${i.transactionDate}, Range ${i.amountRange}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run().catch(console.error);
