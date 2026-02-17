import cron from 'node-cron';
import { fetchRecentTrades } from '../services/congressApi';
import { ingestTrades } from '../services/ingestService';

export const setupTradeSyncCron = (): void => {
  const expr = process.env.CRON_EXPRESSION || '0 */12 * * *';

  console.log(`[CRON] Setting up trade sync cron with expression: ${expr}`);

  cron.schedule(expr, async () => {
    console.log(`[CRON] Running trade sync job at ${new Date().toISOString()}...`);
    try {
      console.log('[CRON] Fetching recent trades...');
      const trades = await fetchRecentTrades();
      console.log(`[CRON] Fetched ${trades.length} trades from API.`);

      if (trades.length === 0) {
        console.log('[CRON] No trades fetched. Skipping ingestion.');
        return;
      }

      console.log('[CRON] Ingesting trades...');
      const { newCount } = await ingestTrades(trades);
      console.log(`[CRON] Ingest complete. New trades inserted: ${newCount}`);
    } catch (err: any) {
      console.error('[CRON] Trade sync job failed:', err.message);
      console.error(err);
    }
  });
};
