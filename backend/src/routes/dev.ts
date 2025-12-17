import { Router, Request, Response } from 'express';
import { ingestTrades } from '../services/ingestService';
import { mockTrades } from '../services/mockTrades';

const router = Router();

/**
 * POST /api/dev/ingest-mock
 * Only enable in development.
 */
router.post('/ingest-mock', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const result = await ingestTrades(mockTrades);
  res.json({ ok: true, result });
});

export default router;
