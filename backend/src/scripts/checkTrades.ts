
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Trade } from '../models/Trade';

dotenv.config();

const checkTrades = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const buys2025 = await Trade.aggregate([
            { $match: { transactionType: 'Buy', transactionDate: { $gte: new Date('2025-01-01') } } },
            { $group: { _id: "$politicianName", count: { $sum: 1 } } }
        ]);
        console.log('Politicians with Buys since 2025:', buys2025);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTrades();
