import mongoose from "mongoose";
import dotenv from "dotenv";
import { Politician } from "./src/models/Politician";
import { assignMockCommittees } from "./src/utils/committeeSectors";

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const pols = await Politician.find({});
        let updated = 0;

        for (const p of pols) {
            if (!p.committees || p.committees.length === 0) {
                p.committees = assignMockCommittees(p.name);
                await p.save();
                updated++;
            }
        }

        console.log(`Successfully backfilled committees for ${updated} politicians.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
