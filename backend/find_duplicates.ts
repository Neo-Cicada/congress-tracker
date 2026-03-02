import 'dotenv/config';
import { connectDB } from './src/config/db';
import { Trade } from './src/models/Trade';
import mongoose from 'mongoose';

const run = async () => {
    await connectDB();
    console.log('Connected. Finding duplicates...');

    // Find if there are identical trades with different externalIds
    const duplicates = await Trade.aggregate([
        {
            $group: {
                _id: {
                    politicianName: "$politicianName",
                    ticker: "$ticker",
                    transactionDate: "$transactionDate",
                    transactionType: "$transactionType"
                },
                count: { $sum: 1 },
                docs: { $push: "$$ROOT" }
            }
        },
        { $match: { count: { $gt: 1 } } },
        { $limit: 3 }
    ]);

    console.log(`Found ${duplicates.length} groups of potential duplicates.`);
    if (duplicates.length > 0) {
        duplicates.forEach(d => {
            console.log(`\nGroup: ${JSON.stringify(d._id)}`);
            d.docs.forEach((doc: any) => {
                console.log(`- ID: ${doc._id}, externalId: ${doc.externalId}, Range: ${doc.amountRange}, Filed: ${doc.filedDate}`);
            });
        });
    }

    // Also check if any externalIds are duplicated
    const dupExternal = await Trade.aggregate([
        { $group: { _id: "$externalId", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
        { $limit: 1 }
    ]);
    console.log(`\nDuplicate externalIds found: ${dupExternal.length}`);

    await mongoose.disconnect();
};

run().catch(console.error);
