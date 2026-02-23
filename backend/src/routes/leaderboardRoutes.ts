import express from 'express';
import { Politician } from '../models/Politician';

const router = express.Router();

// GET /api/leaderboard/party-performance - Get average YTD return by party
router.get('/party-performance', async (req, res) => {
    try {
        const perf = await Politician.aggregate([
            { $match: { 'stats.ytdReturn': { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: '$party',
                    avgReturn: { $avg: '$stats.ytdReturn' }
                }
            }
        ]);

        let demReturn = 0;
        let repReturn = 0;

        for (const p of perf) {
            const partyStr = p._id?.toUpperCase();
            if (partyStr === 'D' || partyStr === 'DEMOCRAT') {
                demReturn = p.avgReturn;
            } else if (partyStr === 'R' || partyStr === 'REPUBLICAN') {
                repReturn = p.avgReturn;
            }
        }

        res.json({ demReturn, repReturn });
    } catch (error) {
        console.error('Error fetching party performance:', error);
        res.status(500).json({ message: 'Error fetching party performance data' });
    }
});

// GET /api/leaderboard - Get top politicians by YTD return
router.get('/', async (req, res) => {
    try {
        const { sort } = req.query;
        const sortOrder = sort === 'asc' ? 1 : -1;

        const leaders = await Politician.find({ 'stats.ytdReturn': { $exists: true } })
            .sort({ 'stats.ytdReturn': sortOrder as any }) // Sort by return dynamic
            .limit(10)
            .select('name party stats photoUrl'); // Select relevant fields

        res.json(leaders);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard data' });
    }
});

export default router;
