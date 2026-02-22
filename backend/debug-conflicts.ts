import mongoose from "mongoose";
import dotenv from "dotenv";
import { Politician } from "./src/models/Politician";
import { Trade } from "./src/models/Trade";
import { getConflictingSectors } from "./src/utils/committeeSectors";

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        const trades = await Trade.find({ sector: { $exists: true, $nin: ['Unknown', ''] } }).limit(20).lean();
        console.log("Found", trades.length, "trades with valid sectors.");

        for (const trade of trades) {
            console.log(`\nTrade: ${trade.politicianName} traded ${trade.ticker} in sector: '${trade.sector}'`);

            const p = await Politician.findOne({ _id: trade.politicianId }).lean();
            if (!p) {
                console.log("  Politician not found.");
                continue;
            }
            console.log("  Politician Committees:", p.committees);

            const conflictingSectors = getConflictingSectors(p.committees || []);
            console.log("  Conflicting Sectors for these committees:", conflictingSectors);

            if (conflictingSectors.includes(trade.sector!)) {
                console.log("  >>> MATCH FOUND!");
            } else {
                console.log("  No match.");
            }
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
