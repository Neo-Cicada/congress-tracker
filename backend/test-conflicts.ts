import mongoose from "mongoose";
import dotenv from "dotenv";
import { Politician } from "./src/models/Politician";
import { Trade } from "./src/models/Trade";

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI as string);
    const pols = await Politician.find({ committees: { $exists: true, $not: {$size: 0} } }).limit(5).lean();
    console.log("Politicians with committees:");
    for (const p of pols) {
        console.log(`- ${p.name}:`, p.committees);
    }
    const trades = await Trade.find({ sector: { $exists: true, $ne: 'Unknown' } }).limit(5).lean();
    console.log("\nSome trades with sectors:");
    for (const t of trades) {
         console.log(`- ${t.politicianName}: ${t.ticker} in ${t.sector}`);
    }
    process.exit(0);
}
run();
