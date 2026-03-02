import 'dotenv/config';
import { connectDB } from '../config/db';
import { Trade } from '../models/Trade';
import mongoose from 'mongoose';

const run = async () => {
    try {
        await connectDB();
        console.log('Connected. Starting cleanup...');

        // Aggregate by unique composite key
        const duplicates = await Trade.aggregate([
            {
                $group: {
                    _id: {
                        politicianName: "$politicianName",
                        ticker: "$ticker",
                        transactionDate: "$transactionDate",
                        transactionType: "$transactionType",
                        amountRange: "$amountRange"
                    },
                    count: { $sum: 1 },
                    docs: { $push: "$$ROOT" }
                }
            },
            { $match: { count: { $gt: 1 } } }
        ]);

        console.log(`Found ${duplicates.length} total keys with duplicates.`);

        let deletedCount = 0;
        for (const group of duplicates) {
            const docs = group.docs;
            // Sort to keep newest ones if they differ by some other metric, otherwise just keep the first
            docs.sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            });

            const docsToDelete = docs.slice(1); // keep the first one (latest based on createdAt)
            const idsToDelete = docsToDelete.map((d: any) => d._id);

            const result = await Trade.deleteMany({ _id: { $in: idsToDelete } });
            deletedCount += result.deletedCount || 0;
            console.log(`Key ${JSON.stringify(group._id)} -> Deleted ${result.deletedCount} duplicates.`);
        }

        console.log(`Cleanup complete. Total deleted records: ${deletedCount}`);

    } catch (e) {
        console.error('Error during cleanup:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

run().catch(console.error);
