
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

        // Check for photoUrl
        const politiciansWithPhoto = await Politician.countDocuments({ photoUrl: { $exists: true, $ne: '' } });
        console.log(`Politicians with photoUrl: ${politiciansWithPhoto}`);

        const sample = await Politician.findOne({ photoUrl: { $exists: true, $ne: '' } });
        if (sample) {
            console.log('Sample Politician with Photo:', sample.name, sample.photoUrl);
        } else {
            console.log('No politicians with photos found.');
        }

        const sampleTrade = await Trade.findOne();
        if (sampleTrade) {
            console.log('Sample Trade:', sampleTrade);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkDb();
