
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Trade } from '../models/Trade';
import { Politician } from '../models/Politician';

dotenv.config();

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to DB');

        const tradeCount = await Trade.countDocuments();
        const politicianCount = await Politician.countDocuments();

        console.log(`Trades: ${tradeCount}`);
        console.log(`Politicians: ${politicianCount}`);

        if (tradeCount > 0) {
            const sampleTrade = await Trade.findOne();
            console.log('Sample Trade:', sampleTrade);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDb();
