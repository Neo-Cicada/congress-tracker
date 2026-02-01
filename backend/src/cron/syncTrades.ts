import cron from 'node-cron';
import { fetchRecentTrades } from '../services/congressApi';
import { ingestTrades } from '../services/ingestService';

export const setupTradeSyncCron = (): void => {
  const expr = process.env.CRON_EXPRESSION || '0 */12 * * *';

  console.log(`Setting up trade sync cron with expression: ${expr}`);

  cron.schedule(expr, async () => {
    console.log('Running trade sync job...');
    try {
      const trades = await fetchRecentTrades();
      console.log(`Fetched ${trades.length} trades from API.`);

      const { newCount } = await ingestTrades(trades);
      console.log(`Ingest complete. New trades inserted: ${newCount}`);
    } catch (err: any) {
      console.error('Trade sync job failed:', err.message);
    }
  });
};
