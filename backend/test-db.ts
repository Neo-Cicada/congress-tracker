import mongoose from "mongoose";
import dotenv from "dotenv";
import { Politician } from "./src/models/Politician";
import { Trade } from "./src/models/Trade";

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const pols = await Politician.find({ "committees.0": { $exists: true } }).limit(5).lean();
        console.log("Politicians with committees count:", pols.length);
        if (pols.length > 0) {
            console.log("Example:", pols[0].name, pols[0].committees);
        } else {
            const allPols = await Politician.find({}).limit(1).lean();
            console.log("Total politicians without committees?", allPols[0]);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
