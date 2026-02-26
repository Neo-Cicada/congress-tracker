import express from 'express';
import { addToWatchlist, removeFromWatchlist, getWatchlist, changePassword, saveTrade, removeSavedTrade, getSavedTrades } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:politicianId', protect, removeFromWatchlist);
router.get('/watchlist', protect, getWatchlist);
router.put('/password', protect, changePassword);

router.post('/saved-trades', protect, saveTrade);
router.delete('/saved-trades/:tradeId', protect, removeSavedTrade);
router.get('/saved-trades', protect, getSavedTrades);

export default router;
