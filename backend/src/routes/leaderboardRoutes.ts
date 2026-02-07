
import express from 'express';
import { Politician } from '../models/Politician';

const router = express.Router();

// GET /api/leaderboard - Get top politicians by YTD return
router.get('/', async (req, res) => {
    try {
        const leaders = await Politician.find({ 'stats.ytdReturn': { $exists: true } })
            .sort({ 'stats.ytdReturn': -1 }) // Sort by return descending
            .limit(10)
            .select('name party stats photoUrl'); // Select relevant fields

        res.json(leaders);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard data' });
    }
});

export default router;
