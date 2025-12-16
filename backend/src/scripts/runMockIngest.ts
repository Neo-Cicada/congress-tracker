import 'dotenv/config';
import { connectDB } from '../config/db';
import { ingestTrades } from '../services/ingestService';
import { mockTrades } from '../services/mockTrades';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log(`Ingesting ${mockTrades.length} mock trades...`);
    const result = await ingestTrades(mockTrades);

    console.log('Ingest complete:', result);
    process.exit(0);
  } catch (err) {
    console.error('Mock ingest failed:', err);
    process.exit(1);
  }
}

run();
