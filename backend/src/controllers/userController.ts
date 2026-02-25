import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const addToWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { politicianId } = req.body;
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User not found in Request' });
            return;
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.watchlist && user.watchlist.includes(politicianId)) {
            res.status(400).json({ message: 'Politician already in watchlist' });
            return;
        }

        user.watchlist = user.watchlist || [];
        user.watchlist.push(politicianId);
        await user.save();

        res.json({ message: 'Added to watchlist', watchlist: user.watchlist });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ message: 'Server error adding to watchlist' });
    }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { politicianId } = req.params;
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User not found in Request' });
            return;
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!user.watchlist) {
            res.status(400).json({ message: 'Watchlist is empty' });
            return;
        }

        user.watchlist = user.watchlist.filter(id => id.toString() !== politicianId);
        await user.save();

        res.json({ message: 'Removed from watchlist', watchlist: user.watchlist });
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        res.status(500).json({ message: 'Server error removing from watchlist' });
    }
};

export const getWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User not found in Request' });
            return;
        }

        const user = await User.findById(req.user.id).populate('watchlist');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user.watchlist || []);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Server error fetching watchlist' });
    }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: 'Please provide current and new password' });
            return;
        }

        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User not found in Request' });
            return;
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Incorrect current password' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.passwordHash = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error changing password' });
    }
};
