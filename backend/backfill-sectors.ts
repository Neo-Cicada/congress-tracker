import mongoose from "mongoose";
import dotenv from "dotenv";
import { Trade } from "./src/models/Trade";

dotenv.config();

const tickerSectors: Record<string, string> = {
    "AAPL": "Technology",
    "MSFT": "Technology",
    "NVDA": "Technology",
    "GOOGL": "Communication Services",
    "TSLA": "Consumer Cyclical",
    "AMZN": "Consumer Cyclical",
    "JPM": "Financial Services",
    "V": "Financial Services",
    "JNJ": "Healthcare",
    "UNH": "Healthcare",
    "LLY": "Healthcare",
    "XOM": "Energy",
    "CVX": "Energy",
    "AG": "Basic Materials",
    "NEE": "Utilities",
    "LMT": "Industrials",
    "RTX": "Industrials",
    "BA": "Industrials"
};

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        const trades = await Trade.find({});
        let updated = 0;

        for (const trade of trades) {
            const sector = tickerSectors[trade.ticker] || "Technology"; // Fallback to Tech for demo purposes
            if (trade.sector !== sector) {
                trade.sector = sector;
                await trade.save();
                updated++;
            }
        }

        console.log(`Updated sectors for ${updated} trades.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
