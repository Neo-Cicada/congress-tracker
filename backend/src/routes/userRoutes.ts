import express from 'express';
import { addToWatchlist, removeFromWatchlist, getWatchlist, changePassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:politicianId', protect, removeFromWatchlist);
router.get('/watchlist', protect, getWatchlist);
router.put('/password', protect, changePassword);

export default router;
