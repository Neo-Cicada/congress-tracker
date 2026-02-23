import { Router, Request, Response } from 'express';
import { ingestTrades } from '../services/ingestService';

const router = Router();

// Add fetch logic import
import { fetchRecentTrades } from '../services/congressApi';

/**
 * POST /api/dev/force-sync
 * Manually trigger the trade sync logic (same as cron).
 */
router.post('/force-sync', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    console.log('[MANUAL] Starting manual trade sync...');
    const trades = await fetchRecentTrades();
    console.log(`[MANUAL] Fetched ${trades.length} trades.`);

    const { newCount } = await ingestTrades(trades);
    console.log(`[MANUAL] Ingest complete. New: ${newCount}`);

    res.json({ ok: true, fetched: trades.length, new: newCount });
  } catch (error: any) {
    console.error('[MANUAL] Sync failed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
